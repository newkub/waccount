<script setup lang="ts">
import type { SlotLayout } from "~/shared/types/slots";

interface Props {
	enabled?: boolean;
	channel?: string;
}

const props = withDefaults(defineProps<Props>(), {
	enabled: true,
	channel: "slots",
});

const slotManager = useSlotManager();
const user = useUser();
const projectContext = useProjectContext();

const isConnected = ref(false);
const lastSyncTime = ref<Date | null>(null);
const syncError = ref<string | null>(null);

let eventSource: EventSource | null = null;

const connect = () => {
	if (!props.enabled || !user.value?.id) return;

	const url = new URL("/api/slots/sync", window.location.origin);
	url.searchParams.set("userId", user.value.id);
	if (projectContext.value?.id) {
		url.searchParams.set("projectContext", projectContext.value.id);
	}

	eventSource = new EventSource(url.toString());

	eventSource.onopen = () => {
		isConnected.value = true;
		syncError.value = null;
	};

	eventSource.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			handleSyncEvent(data);
			lastSyncTime.value = new Date();
		} catch (e) {
			console.error("Failed to parse sync event:", e);
		}
	};

	eventSource.onerror = (error) => {
		isConnected.value = false;
		syncError.value = "Connection error";
		console.error("EventSource error:", error);
	};
};

const disconnect = () => {
	if (eventSource) {
		eventSource.close();
		eventSource = null;
	}
	isConnected.value = false;
};

const handleSyncEvent = (data: any) => {
	switch (data.type) {
		case "layout_updated":
			if (slotManager.layout.value?.id === data.layoutId) {
				slotManager.fetchLayout();
			}
			break;
		case "slot_visibility_changed":
			if (slotManager.layout.value) {
				const slot = slotManager.layout.value.slots.find((s) => s.slotId === data.slotId);
				if (slot) {
					slot.visible = data.visible;
				}
			}
			break;
		case "slot_order_changed":
			if (slotManager.layout.value) {
				slotManager.layout.value.slots = data.slots;
			}
			break;
		case "slot_customized":
			if (slotManager.layout.value) {
				const slot = slotManager.layout.value.slots.find((s) => s.slotId === data.slotId);
				if (slot) {
					Object.assign(slot, data.updates);
				}
			}
			break;
		default:
			console.warn("Unknown sync event type:", data.type);
	}
};

const broadcastChange = async (type: string, payload: any) => {
	if (!props.enabled || !user.value?.id) return;

	try {
		await $fetch("/api/slots/sync/broadcast", {
			method: "POST",
			body: {
				type,
				userId: user.value.id,
				projectContext: projectContext.value?.id,
				...payload,
			},
		});
	} catch (e) {
		console.error("Failed to broadcast change:", e);
	}
};

const broadcastLayoutUpdate = (layoutId: string) => {
	broadcastChange("layout_updated", { layoutId });
};

const broadcastSlotVisibility = (slotId: string, visible: boolean) => {
	broadcastChange("slot_visibility_changed", { slotId, visible });
};

const broadcastSlotOrder = (slots: any[]) => {
	broadcastChange("slot_order_changed", { slots });
};

const broadcastSlotCustomization = (slotId: string, updates: any) => {
	broadcastChange("slot_customized", { slotId, updates });
};

onMounted(() => {
	connect();
});

onUnmounted(() => {
	disconnect();
});

watch([user, projectContext], () => {
	if (props.enabled) {
		disconnect();
		connect();
	}
});

watch(
	() => props.enabled,
	(enabled) => {
		if (enabled) {
			connect();
		} else {
			disconnect();
		}
	},
);

defineExpose({
	broadcastLayoutUpdate,
	broadcastSlotVisibility,
	broadcastSlotOrder,
	broadcastSlotCustomization,
	isConnected,
	lastSyncTime,
	syncError,
});
</script>

<template>
	<div v-if="enabled" class="sync-indicator">
		<div
			:class="[
				'sync-indicator__status',
				{
					'sync-indicator__status--connected': isConnected,
					'sync-indicator__status--disconnected': !isConnected,
				},
			]"
		>
			<Icon :name="isConnected ? 'mdi:sync' : 'mdi:sync-off'" :class="{ 'animate-spin': isConnected }" />
		</div>
		<div v-if="lastSyncTime" class="sync-indicator__time">
			{{ new Date(lastSyncTime).toLocaleTimeString() }}
		</div>
		<div v-if="syncError" class="sync-indicator__error">
			{{ syncError }}
		</div>
	</div>
</template>

<style scoped>
.sync-indicator {
	@apply flex items-center gap-2 px-3 py-1.5 rounded;
	@apply bg-slate-100 dark:bg-slate-800;
}

.sync-indicator__status {
	@apply flex items-center;
}

.sync-indicator__status--connected {
	@apply text-green-500;
}

.sync-indicator__status--disconnected {
	@apply text-red-500;
}

.sync-indicator__time {
	@apply text-xs text-slate-500 dark:text-slate-400;
}

.sync-indicator__error {
	@apply text-xs text-red-500;
}
</style>
