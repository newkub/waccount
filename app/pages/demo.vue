<script setup lang="ts">
const slotManager = useSlotManager();
const projectContext = useProjectContext();

const breakpoint = ref<"mobile" | "tablet" | "desktop">("desktop");
const showPreviewMode = ref(false);

const updateBreakpoint = () => {
	const width = window.innerWidth;
	if (width < 768) {
		breakpoint.value = "mobile";
	} else if (width < 1024) {
		breakpoint.value = "tablet";
	} else {
		breakpoint.value = "desktop";
	}
};

onMounted(() => {
	updateBreakpoint();
	window.addEventListener("resize", updateBreakpoint);
});

onUnmounted(() => {
	window.removeEventListener("resize", updateBreakpoint);
});

const isMobile = computed(() => breakpoint.value === "mobile");
const isTablet = computed(() => breakpoint.value === "tablet");
const isDesktop = computed(() => breakpoint.value === "desktop");
</script>

<template>
	<div class="demo-page">
		<div class="demo-page__header">
			<h1>Custom Slot Tab System Demo</h1>
			<div class="demo-page__controls">
				<button
					:class="['demo-page__breakpoint', { 'demo-page__breakpoint--active': breakpoint === 'mobile' }]"
					@click="breakpoint = 'mobile'"
				>
					<Icon name="mdi:cellphone" />
					Mobile
				</button>
				<button
					:class="['demo-page__breakpoint', { 'demo-page__breakpoint--active': breakpoint === 'tablet' }]"
					@click="breakpoint = 'tablet'"
				>
					<Icon name="mdi:tablet" />
					Tablet
				</button>
				<button
					:class="['demo-page__breakpoint', { 'demo-page__breakpoint--active': breakpoint === 'desktop' }]"
					@click="breakpoint = 'desktop'"
				>
					<Icon name="mdi:monitor" />
					Desktop
				</button>
				<button
					class="demo-page__preview-toggle"
					:class="{ 'demo-page__preview-toggle--active': showPreviewMode }"
					@click="showPreviewMode = !showPreviewMode"
				>
					<Icon :name="showPreviewMode ? 'mdi:eye' : 'mdi:eye-off'" />
					{{ showPreviewMode ? "Exit Preview" : "Preview Mode" }}
				</button>
			</div>
		</div>

		<div class="demo-page__content">
			<ResponsiveSlotLayout
				:is-mobile="isMobile"
				:is-tablet="isTablet"
				:is-desktop="isDesktop"
			>
				<SlotPreviewMode v-if="showPreviewMode" />
				<SlotManager v-else />
			</ResponsiveSlotLayout>
		</div>

		<div class="demo-page__info">
			<div class="demo-page__info-section">
				<h3>Features</h3>
				ul>
					<li>Drag and drop to reorder slots</li>
					<li>Pin important slots</li>
					<li>Show/hide slots</li>
					<li>Customize slot titles and icons</li>
					<li>Apply templates</li>
					<li>Export/import layouts</li>
					<li>Version history</li>
					<li>Analytics tracking</li>
					<li>Responsive design</li>
					<li>Preview mode</li>
				</ul>
			</div>

			<div class="demo-page__info-section">
				<h3>Current Context</h3>
				<p v-if="projectContext.currentContext">
					<strong>{{ projectContext.currentContext.name }}</strong>
					({{ projectContext.currentContext.type }})
				</p>
				<p v-else>No context selected</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo-page {
	@apply min-h-screen bg-slate-50 dark:bg-slate-900;
}

.demo-page__header {
	@apply flex items-center justify-between px-6 py-4;
	@apply bg-white dark:bg-slate-800;
	@apply border-b border-slate-200 dark:border-slate-700;
}

.demo-page__header h1 {
	@apply text-xl font-bold;
}

.demo-page__controls {
	@apply flex items-center gap-3;
}

.demo-page__breakpoint {
	@apply flex items-center gap-2 px-3 py-1.5 rounded;
	@apply bg-slate-100 dark:bg-slate-700;
	@apply text-slate-600 dark:text-slate-400;
	@apply hover:bg-slate-200 dark:hover:bg-slate-600;
	@apply transition-colors duration-150;
}

.demo-page__breakpoint--active {
	@apply bg-blue-100 dark:bg-blue-900;
	@apply text-blue-700 dark:text-blue-300;
}

.demo-page__preview-toggle {
	@apply flex items-center gap-2 px-3 py-1.5 rounded;
	@apply bg-amber-100 dark:bg-amber-900;
	@apply text-amber-700 dark:text-amber-300;
	@apply hover:bg-amber-200 dark:hover:bg-amber-800;
	@apply transition-colors duration-150;
}

.demo-page__preview-toggle--active {
	@apply bg-amber-500 dark:bg-amber-600;
	@apply text-white;
}

.demo-page__content {
	@apply h-[calc(100vh-180px)];
}

.demo-page__info {
	@apply px-6 py-4;
	@apply bg-white dark:bg-slate-800;
	@apply border-t border-slate-200 dark:border-slate-700;
	@apply grid grid-cols-2 gap-6;
}

.demo-page__info-section h3 {
	@apply text-sm font-semibold mb-2;
}

.demo-page__info-section ul {
	@apply list-disc list-inside space-y-1;
	@apply text-sm text-slate-600 dark:text-slate-400;
}
</style>
