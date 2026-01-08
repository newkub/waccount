<script setup lang="ts">
import type { SlotConfig, SlotState } from "~/shared/types/slots";

interface Props {
	slot: SlotConfig;
	state: SlotState;
	isActive?: boolean;
	draggable?: boolean;
	previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isActive: false,
	draggable: true,
	previewMode: false,
});

const emit = defineEmits<{
	click: [];
	"update:visibility": [visible: boolean];
	"update:pin": [pinned: boolean];
	"start-drag": [];
	"end-drag": [];
}>();

const slotManager = useSlotManager();
const slotAnalytics = useSlotAnalytics();

const isDragging = ref(false);
const isHovered = ref(false);

const displayTitle = computed(() => props.state.customTitle || props.slot.title);
const displayIcon = computed(() => props.state.customIcon || props.slot.icon);

const handleClick = () => {
	if (!props.previewMode) {
		slotAnalytics.trackSlotView(props.slot.id);
		emit("click");
	}
};

const handleDragStart = () => {
	isDragging.value = true;
	emit("start-drag");
};

const handleDragEnd = () => {
	isDragging.value = false;
	emit("end-drag");
};

const toggleVisibility = () => {
	emit("update:visibility", !props.state.visible);
};

const togglePin = () => {
	emit("update:pin", !props.state.pinned);
};
</script>

<template>
	<div
		:class="[
			'slot-tab',
			{ 'slot-tab--active': isActive },
			{ 'slot-tab--dragging': isDragging },
			{ 'slot-tab--preview': previewMode },
		]"
		:draggable="draggable && !previewMode"
		@dragstart="handleDragStart"
		@dragend="handleDragEnd"
		@click="handleClick"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<div class="slot-tab__content">
			<div v-if="displayIcon" class="slot-tab__icon">
				<Icon :name="displayIcon" />
			</div>
			<span class="slot-tab__title">{{ displayTitle }}</span>
			<div v-if="state.pinned" class="slot-tab__pin">
				<Icon name="mdi:pin" size="14" />
			</div>
		</div>

		<div v-if="isHovered && !previewMode" class="slot-tab__actions">
			<button
				v-if="!state.pinned"
				class="slot-tab__action"
				:title="'Pin'"
				@click.stop="togglePin"
			>
				<Icon name="mdi:pin-outline" size="16" />
			</button>
			<button
				v-else
				class="slot-tab__action"
				:title="'Unpin'"
				@click.stop="togglePin"
			>
				<Icon name="mdi:pin-off" size="16" />
			</button>
			<button
				class="slot-tab__action"
				:title="state.visible ? 'Hide' : 'Show'"
				@click.stop="toggleVisibility"
			>
				<Icon :name="state.visible ? 'mdi:eye-off' : 'mdi:eye'" size="16" />
			</button>
		</div>
	</div>
</template>

<style scoped>
.slot-tab {
	@apply relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200;
	@apply bg-slate-100 dark:bg-slate-800;
	@apply hover:bg-slate-200 dark:hover:bg-slate-700;
	@apply select-none;
}

.slot-tab--active {
	@apply bg-blue-100 dark:bg-blue-900;
	@apply ring-2 ring-blue-500;
}

.slot-tab--dragging {
	@apply opacity-50;
}

.slot-tab--preview {
	@apply cursor-default;
}

.slot-tab__content {
	@apply flex items-center gap-2;
}

.slot-tab__icon {
	@apply flex-shrink-0;
}

.slot-tab__title {
	@apply text-sm font-medium truncate;
}

.slot-tab__pin {
	@apply flex-shrink-0 text-blue-500;
}

.slot-tab__actions {
	@apply absolute right-2 flex items-center gap-1 px-1 py-0.5 rounded;
	@apply bg-white dark:bg-slate-900;
	@apply shadow-md;
	@apply opacity-0 transition-opacity duration-200;
}

.slot-tab:hover .slot-tab__actions {
	@apply opacity-100;
}

.slot-tab__action {
	@apply p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800;
	@apply text-slate-600 dark:text-slate-400;
	@apply transition-colors duration-150;
}
</style>
