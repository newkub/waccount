<script setup lang="ts">
interface Props {
	isMobile?: boolean;
	isTablet?: boolean;
	isDesktop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isMobile: false,
	isTablet: false,
	isDesktop: true,
});

const slotManager = useSlotManager();

const breakpoint = computed(() => {
	if (props.isMobile) return "mobile";
	if (props.isTablet) return "tablet";
	return "desktop";
});

const layoutClasses = computed(() => {
	return {
		"responsive-layout--mobile": props.isMobile,
		"responsive-layout--tablet": props.isTablet,
		"responsive-layout--desktop": props.isDesktop,
	};
});

const slotPanelClasses = computed(() => {
	if (props.isMobile) {
		return "responsive-layout__panel--mobile";
	}
	if (props.isTablet) {
		return "responsive-layout__panel--tablet";
	}
	return "responsive-layout__panel--desktop";
});
</script>

<template>
	<div :class="['responsive-layout', layoutClasses]">
		<div class="responsive-layout__sidebar">
			<SlotManager />
		</div>

		<div :class="['responsive-layout__panel', slotPanelClasses]">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.responsive-layout {
	@apply flex h-full;
}

.responsive-layout--mobile {
	@apply flex-col;
}

.responsive-layout--tablet {
	@apply flex-row;
}

.responsive-layout--desktop {
	@apply flex-row;
}

.responsive-layout__sidebar {
	@apply flex-shrink-0;
}

.responsive-layout--mobile .responsive-layout__sidebar {
	@apply w-full h-auto max-h-[200px];
}

.responsive-layout--tablet .responsive-layout__sidebar {
	@apply w-64 h-full;
}

.responsive-layout--desktop .responsive-layout__sidebar {
	@apply w-80 h-full;
}

.responsive-layout__panel {
	@apply flex-1 overflow-hidden;
}

.responsive-layout__panel--mobile {
	@apply w-full;
}

.responsive-layout__panel--tablet {
	@apply w-full;
}

.responsive-layout__panel--desktop {
	@apply w-full;
}
</style>
