<script setup lang="ts">
const slotManager = useSlotManager();
const syncRef = ref<InstanceType<typeof SlotSync> | null>(null);

const originalUpdateSlotVisibility = slotManager.updateSlotVisibility;
const originalUpdateSlotOrder = slotManager.updateSlotOrder;
const originalUpdateSlotCustomization = slotManager.updateSlotCustomization;
const originalSaveLayout = slotManager.saveLayout;

slotManager.updateSlotVisibility = async (slotId: string, visible: boolean) => {
	await originalUpdateSlotVisibility(slotId, visible);
	syncRef.value?.broadcastSlotVisibility(slotId, visible);
};

slotManager.updateSlotOrder = async (slotId: string, newOrder: number) => {
	await originalUpdateSlotOrder(slotId, newOrder);
	if (slotManager.layout.value) {
		syncRef.value?.broadcastSlotOrder(slotManager.layout.value.slots);
	}
};

slotManager.updateSlotCustomization = async (
	slotId: string,
	updates: Partial<{ customTitle: string; customIcon: string }>,
) => {
	await originalUpdateSlotCustomization(slotId, updates);
	syncRef.value?.broadcastSlotCustomization(slotId, updates);
};

slotManager.saveLayout = async () => {
	const result = await originalSaveLayout();
	if (slotManager.layout.value) {
		syncRef.value?.broadcastLayoutUpdate(slotManager.layout.value.id);
	}
	return result;
};
</script>

<template>
	<div class="slot-manager-with-sync">
		<SlotSync ref="syncRef" :enabled="true" />
		<SlotManager />
	</div>
</template>

<style scoped>
.slot-manager-with-sync {
	@apply relative flex flex-col h-full;
}
</style>
