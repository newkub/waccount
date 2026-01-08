<script setup lang="ts">
import type { SlotConfig, SlotState } from "~/shared/types/slots";

interface Props {
	previewMode?: boolean;
	enableAnalytics?: boolean;
	enableVersioning?: boolean;
	maxSlots?: number;
}

const props = withDefaults(defineProps<Props>(), {
	previewMode: false,
	enableAnalytics: true,
	enableVersioning: true,
	maxSlots: 20,
});

const slotManager = useSlotManager();
const slotPermissions = useSlotPermissions();
const slotTemplates = useSlotTemplates();
const slotVersioning = useSlotVersioning();
const projectContext = useProjectContext();

const activeSlotId = ref<string | null>(null);
const showHiddenSlots = ref(false);
const showSettings = ref(false);
const isDragging = ref(false);
const draggedSlotId = ref<string | null>(null);

const accessibleSlots = computed(() => {
	return slotPermissions.filterAccessibleSlots(slotManager.availableSlots.value);
});

const activeSlots = computed(() => {
	return slotManager.activeSlots.value
		.map((state) => ({
			state,
			config: accessibleSlots.value.find((c) => c.id === state.slotId),
		}))
		.filter((item) => item.config)
		.sort((a, b) => a.state.order - b.state.order);
});

const hiddenSlots = computed(() => {
	return slotManager.hiddenSlots.value
		.map((state) => ({
			state,
			config: accessibleSlots.value.find((c) => c.id === state.slotId),
		}))
		.filter((item) => item.config);
});

const pinnedSlots = computed(() => {
	return slotManager.pinnedSlots.value
		.map((state) => ({
			state,
			config: accessibleSlots.value.find((c) => c.id === state.slotId),
		}))
		.filter((item) => item.config);
});

const canAddMoreSlots = computed(() => {
	return activeSlots.value.length < props.maxSlots;
});

const handleSlotClick = (slotId: string) => {
	if (props.previewMode) return;
	activeSlotId.value = slotId;
};

const handleSlotVisibility = async (slotId: string, visible: boolean) => {
	if (props.previewMode) return;
	await slotManager.updateSlotVisibility(slotId, visible);
};

const handleSlotPin = async (slotId: string, pinned: boolean) => {
	if (props.previewMode) return;
	await slotManager.toggleSlotPin(slotId);
};

const handleDragStart = (slotId: string) => {
	isDragging.value = true;
	draggedSlotId.value = slotId;
};

const handleDragEnd = () => {
	isDragging.value = false;
	draggedSlotId.value = null;
};

const handleDrop = async (targetSlotId: string) => {
	if (!draggedSlotId.value || draggedSlotId.value === targetSlotId) return;

	const draggedIndex = activeSlots.value.findIndex((s) => s.state.slotId === draggedSlotId.value);
	const targetIndex = activeSlots.value.findIndex((s) => s.state.slotId === targetSlotId);

	if (draggedIndex === -1 || targetIndex === -1) return;

	await slotManager.updateSlotOrder(draggedSlotId.value, targetIndex);
};

const handleResetToDefaults = async () => {
	await slotManager.resetToDefaults();
};

const handleApplyTemplate = async (templateId: string) => {
	await slotManager.applyTemplate(templateId);
};

const handleExportLayout = () => {
	const layoutData = slotManager.exportLayout();
	if (layoutData) {
		const blob = new Blob([layoutData], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `slot-layout-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
};

const handleImportLayout = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	const text = await file.text();
	await slotManager.importLayout(text);
	target.value = "";
};

const handleCreateVersion = async () => {
	if (!slotManager.layout.value || !props.enableVersioning) return;
	await slotVersioning.createVersion(slotManager.layout.value.id, slotManager.layout.value.slots);
};

const handleRestoreVersion = async (versionId: string) => {
	const slots = await slotVersioning.restoreVersion(versionId);
	if (slots && slotManager.layout.value) {
		slotManager.layout.value.slots = slots;
		await slotManager.saveLayout();
	}
};

const activeSlotConfig = computed(() => {
	if (!activeSlotId.value) return null;
	return accessibleSlots.value.find((c) => c.id === activeSlotId.value);
});
</script>

<template>
	<div class="slot-manager">
		<div class="slot-manager__header">
			<div class="slot-manager__title">
				<h2>Slots</h2>
				<span v-if="projectContext.currentContext" class="slot-manager__context">
					{{ projectContext.currentContext.name }}
				</span>
			</div>
			<div class="slot-manager__actions">
				<button
					v-if="!previewMode"
					class="slot-manager__button"
					:title="'Settings'"
					@click="showSettings = !showSettings"
				>
					<Icon name="mdi:cog" />
				</button>
				<button
					v-if="!previewMode"
					class="slot-manager__button"
					:title="'Show/Hide hidden slots'"
					@click="showHiddenSlots = !showHiddenSlots"
				>
					<Icon :name="showHiddenSlots ? 'mdi:eye-off' : 'mdi:eye'" />
				</button>
			</div>
		</div>

		<div class="slot-manager__content">
			<div v-if="pinnedSlots.length > 0" class="slot-manager__section">
				<h3 class="slot-manager__section-title">Pinned</h3>
				<div class="slot-manager__tabs">
					<SlotTab
						v-for="{ state, config } in pinnedSlots"
						:key="state.slotId"
						:slot="config!"
						:state="state"
						:is-active="activeSlotId === state.slotId"
						:draggable="!previewMode"
						:preview-mode="previewMode"
						@click="handleSlotClick(state.slotId)"
						@update:visibility="handleSlotVisibility(state.slotId, $event)"
						@update:pin="handleSlotPin(state.slotId, $event)"
						@start-drag="handleDragStart(state.slotId)"
						@end-drag="handleDragEnd"
						@drop="handleDrop(state.slotId)"
					/>
				</div>
			</div>

			<div class="slot-manager__section">
				<h3 class="slot-manager__section-title">Active</h3>
				<div class="slot-manager__tabs">
					<SlotTab
						v-for="{ state, config } in activeSlots.filter((s) => !s.state.pinned)"
						:key="state.slotId"
						:slot="config!"
						:state="state"
						:is-active="activeSlotId === state.slotId"
						:draggable="!previewMode"
						:preview-mode="previewMode"
						@click="handleSlotClick(state.slotId)"
						@update:visibility="handleSlotVisibility(state.slotId, $event)"
						@update:pin="handleSlotPin(state.slotId, $event)"
						@start-drag="handleDragStart(state.slotId)"
						@end-drag="handleDragEnd"
						@drop="handleDrop(state.slotId)"
					/>
				</div>
			</div>

			<div v-if="showHiddenSlots && hiddenSlots.length > 0" class="slot-manager__section">
				<h3 class="slot-manager__section-title">Hidden</h3>
				<div class="slot-manager__tabs">
					<SlotTab
						v-for="{ state, config } in hiddenSlots"
						:key="state.slotId"
						:slot="config!"
						:state="state"
						:is-active="false"
						:draggable="false"
						:preview-mode="previewMode"
						@click="handleSlotClick(state.slotId)"
						@update:visibility="handleSlotVisibility(state.slotId, $event)"
						@update:pin="handleSlotPin(state.slotId, $event)"
					/>
				</div>
			</div>
		</div>

		<div v-if="activeSlotConfig" class="slot-manager__panel">
			<component :is="activeSlotConfig.component" />
		</div>

		<Transition name="slide">
			<div v-if="showSettings && !previewMode" class="slot-manager__settings">
				<div class="slot-manager__settings-header">
					<h3>Settings</h3>
					<button class="slot-manager__close" @click="showSettings = false">
						<Icon name="mdi:close" />
					</button>
				</div>

				<div class="slot-manager__settings-content">
					<div class="slot-manager__settings-section">
						<h4>Layout</h4>
						<button class="slot-manager__settings-button" @click="handleResetToDefaults">
							<Icon name="mdi:refresh" />
							Reset to Defaults
						</button>
						<button class="slot-manager__settings-button" @click="handleExportLayout">
							<Icon name="mdi:download" />
							Export Layout
						</button>
						<label class="slot-manager__settings-button">
							<Icon name="mdi:upload" />
							Import Layout
							<input type="file" accept=".json" @change="handleImportLayout">
						</label>
					</div>

					<div v-if="enableVersioning" class="slot-manager__settings-section">
						<h4>Versioning</h4>
						<button class="slot-manager__settings-button" @click="handleCreateVersion">
							<Icon name="mdi:content-save" />
							Create Version
						</button>
						<div v-if="slotVersioning.getVersionHistory().value.length > 0" class="slot-manager__versions">
							<div
								v-for="version in slotVersioning.getVersionHistory().value"
								:key="version.id"
								class="slot-manager__version"
							>
								<span>v{{ version.version }}</span>
								<span class="slot-manager__version-date">
									{{ new Date(version.createdAt).toLocaleString() }}
								</span>
								<button @click="handleRestoreVersion(version.id)">
									<Icon name="mdi:history" />
								</button>
							</div>
						</div>
					</div>

					<div class="slot-manager__settings-section">
						<h4>Templates</h4>
						<div class="slot-manager__templates">
							<button
								v-for="template in slotTemplates.getDefaultTemplates().value"
								:key="template.id"
								class="slot-manager__template"
								@click="handleApplyTemplate(template.id)"
							>
								{{ template.name }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.slot-manager {
	@apply flex flex-col h-full bg-white dark:bg-slate-900;
}

.slot-manager__header {
	@apply flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700;
}

.slot-manager__title {
	@apply flex items-center gap-2;
}

.slot-manager__title h2 {
	@apply text-lg font-semibold;
}

.slot-manager__context {
	@apply text-sm text-slate-500 dark:text-slate-400;
}

.slot-manager__actions {
	@apply flex items-center gap-2;
}

.slot-manager__button {
	@apply p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800;
	@apply text-slate-600 dark:text-slate-400;
	@apply transition-colors duration-150;
}

.slot-manager__content {
	@apply flex-1 overflow-y-auto p-4 space-y-4;
}

.slot-manager__section {
	@apply space-y-2;
}

.slot-manager__section-title {
	@apply text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400;
}

.slot-manager__tabs {
	@apply flex flex-wrap gap-2;
}

.slot-manager__panel {
	@apply border-t border-slate-200 dark:border-slate-700;
	@apply min-h-[200px];
}

.slot-manager__settings {
	@apply absolute inset-0 bg-white dark:bg-slate-900 z-10;
}

.slot-manager__settings-header {
	@apply flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700;
}

.slot-manager__settings-header h3 {
	@apply text-lg font-semibold;
}

.slot-manager__close {
	@apply p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800;
	@apply text-slate-600 dark:text-slate-400;
}

.slot-manager__settings-content {
	@apply p-4 space-y-6 overflow-y-auto;
}

.slot-manager__settings-section {
	@apply space-y-3;
}

.slot-manager__settings-section h4 {
	@apply text-sm font-semibold;
}

.slot-manager__settings-button {
	@apply flex items-center gap-2 w-full px-4 py-2 rounded;
	@apply bg-slate-100 dark:bg-slate-800;
	@apply hover:bg-slate-200 dark:hover:bg-slate-700;
	@apply text-slate-700 dark:text-slate-300;
	@apply transition-colors duration-150;
}

.slot-manager__settings-button input[type="file"] {
	@apply hidden;
}

.slot-manager__versions {
	@apply space-y-2 mt-2;
}

.slot-manager__version {
	@apply flex items-center justify-between px-3 py-2 rounded;
	@apply bg-slate-100 dark:bg-slate-800;
}

.slot-manager__version-date {
	@apply text-xs text-slate-500 dark:text-slate-400;
}

.slot-manager__templates {
	@apply flex flex-wrap gap-2;
}

.slot-manager__template {
	@apply px-3 py-1.5 rounded;
	@apply bg-blue-100 dark:bg-blue-900;
	@apply text-blue-700 dark:text-blue-300;
	@apply hover:bg-blue-200 dark:hover:bg-blue-800;
	@apply transition-colors duration-150;
}

.slide-enter-active,
.slide-leave-active {
	@apply transition-transform duration-300;
}

.slide-enter-from,
.slide-leave-to {
	@apply translate-x-full;
}
</style>
