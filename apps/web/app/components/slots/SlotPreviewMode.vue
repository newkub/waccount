<script setup lang="ts">
interface Props {
	previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	previewMode: false,
});

const slotManager = useSlotManager();

const originalLayout = ref<string | null>(null);
const isPreviewMode = ref(props.previewMode);

const enterPreviewMode = () => {
	originalLayout.value = slotManager.exportLayout();
	isPreviewMode.value = true;
};

const exitPreviewMode = () => {
	if (originalLayout.value) {
		slotManager.importLayout(originalLayout.value);
	}
	originalLayout.value = null;
	isPreviewMode.value = false;
};

const applyPreview = async () => {
	originalLayout.value = null;
	isPreviewMode.value = false;
	await slotManager.saveLayout();
};

const cancelPreview = () => {
	exitPreviewMode();
};

watch(
	() => props.previewMode,
	(newValue) => {
		if (newValue && !isPreviewMode.value) {
			enterPreviewMode();
		} else if (!newValue && isPreviewMode.value) {
			exitPreviewMode();
		}
	},
);
</script>

<template>
	<div v-if="isPreviewMode" class="preview-mode-bar">
		<div class="preview-mode-bar__content">
			<div class="preview-mode-bar__indicator">
				<Icon name="mdi:eye" />
				<span>Preview Mode</span>
			</div>
			<div class="preview-mode-bar__actions">
				<button class="preview-mode-bar__button preview-mode-bar__button--cancel" @click="cancelPreview">
					<Icon name="mdi:close" />
					Cancel
				</button>
				<button class="preview-mode-bar__button preview-mode-bar__button--apply" @click="applyPreview">
					<Icon name="mdi:check" />
					Apply Changes
				</button>
			</div>
		</div>
	</div>

	<SlotManager :preview-mode="isPreviewMode" />
</template>

<style scoped>
.preview-mode-bar {
	@apply fixed top-0 left-0 right-0 z-50;
	@apply bg-amber-100 dark:bg-amber-900;
	@apply border-b border-amber-300 dark:border-amber-700;
	@apply shadow-lg;
}

.preview-mode-bar__content {
	@apply flex items-center justify-between px-4 py-3;
}

.preview-mode-bar__indicator {
	@apply flex items-center gap-2;
	@apply text-amber-800 dark:text-amber-200;
	@apply font-semibold;
}

.preview-mode-bar__actions {
	@apply flex items-center gap-2;
}

.preview-mode-bar__button {
	@apply flex items-center gap-2 px-4 py-2 rounded;
	@apply font-medium;
	@apply transition-colors duration-150;
}

.preview-mode-bar__button--cancel {
	@apply bg-white dark:bg-slate-800;
	@apply text-slate-700 dark:text-slate-300;
	@apply hover:bg-slate-100 dark:hover:bg-slate-700;
}

.preview-mode-bar__button--apply {
	@apply bg-amber-500 dark:bg-amber-600;
	@apply text-white;
	@apply hover:bg-amber-600 dark:hover:bg-amber-700;
}
</style>
