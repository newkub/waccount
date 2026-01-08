import type { SlotConfig, SlotLayout, SlotState } from "~/shared/types/slots";

export const useSlotManager = () => {
	const user = useUser();
	const projectContext = useProjectContext();
	const { $fetch } = useNuxtApp();

	const layout = ref<SlotLayout | null>(null);
	const availableSlots = ref<SlotConfig[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const activeSlots = computed(() => {
		if (!layout.value) return [];
		return layout.value.slots
			.filter((slot) => slot.visible)
			.sort((a, b) => a.order - b.order);
	});

	const hiddenSlots = computed(() => {
		if (!layout.value) return [];
		return layout.value.slots.filter((slot) => !slot.visible);
	});

	const pinnedSlots = computed(() => {
		if (!layout.value) return [];
		return layout.value.slots.filter((slot) => slot.pinned);
	});

	const fetchLayout = async () => {
		if (!user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotLayout>("/api/slots/layout", {
				query: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
				},
			});
			layout.value = response;
		} catch (e) {
			error.value = "Failed to fetch slot layout";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const fetchAvailableSlots = async () => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotConfig[]>("/api/slots/configs");
			availableSlots.value = response;
		} catch (e) {
			error.value = "Failed to fetch available slots";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const updateSlotVisibility = async (slotId: string, visible: boolean) => {
		if (!layout.value) return;

		const slotIndex = layout.value.slots.findIndex((s) => s.slotId === slotId);
		if (slotIndex === -1) return;

		layout.value.slots[slotIndex].visible = visible;

		await saveLayout();
	};

	const updateSlotOrder = async (slotId: string, newOrder: number) => {
		if (!layout.value) return;

		const slotIndex = layout.value.slots.findIndex((s) => s.slotId === slotId);
		if (slotIndex === -1) return;

		const oldOrder = layout.value.slots[slotIndex].order;
		layout.value.slots[slotIndex].order = newOrder;

		layout.value.slots.forEach((slot) => {
			if (slot.slotId === slotId) return;
			if (oldOrder < newOrder && slot.order > oldOrder && slot.order <= newOrder) {
				slot.order--;
			} else if (oldOrder > newOrder && slot.order >= newOrder && slot.order < oldOrder) {
				slot.order++;
			}
		});

		await saveLayout();
	};

	const updateSlotCustomization = async (
		slotId: string,
		updates: Partial<Pick<SlotState, "customTitle" | "customIcon">>,
	) => {
		if (!layout.value) return;

		const slotIndex = layout.value.slots.findIndex((s) => s.slotId === slotId);
		if (slotIndex === -1) return;

		Object.assign(layout.value.slots[slotIndex], updates);

		await saveLayout();
	};

	const toggleSlotPin = async (slotId: string) => {
		if (!layout.value) return;

		const slotIndex = layout.value.slots.findIndex((s) => s.slotId === slotId);
		if (slotIndex === -1) return;

		layout.value.slots[slotIndex].pinned = !layout.value.slots[slotIndex].pinned;

		await saveLayout();
	};

	const saveLayout = async () => {
		if (!layout.value || !user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotLayout>("/api/slots/layout", {
				method: "PUT",
				body: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
					slots: layout.value.slots,
				},
			});
			layout.value = response;
		} catch (e) {
			error.value = "Failed to save slot layout";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const resetToDefaults = async () => {
		if (!user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			await $fetch("/api/slots/layout/reset", {
				method: "POST",
				body: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
				},
			});
			await fetchLayout();
		} catch (e) {
			error.value = "Failed to reset layout";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const applyTemplate = async (templateId: string) => {
		if (!user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotLayout>("/api/slots/layout/apply-template", {
				method: "POST",
				body: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
					templateId,
				},
			});
			layout.value = response;
		} catch (e) {
			error.value = "Failed to apply template";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const exportLayout = () => {
		if (!layout.value) return null;

		return JSON.stringify({
			slots: layout.value.slots,
			projectContext: projectContext.value?.id,
			exportedAt: new Date().toISOString(),
		}, null, 2);
	};

	const importLayout = async (layoutData: string) => {
		try {
			const parsed = JSON.parse(layoutData);
			if (!parsed.slots || !Array.isArray(parsed.slots)) {
				throw new Error("Invalid layout data");
			}

			if (!user.value?.id) return;

			const response = await $fetch<SlotLayout>("/api/slots/layout", {
				method: "PUT",
				body: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
					slots: parsed.slots,
				},
			});
			layout.value = response;
		} catch (e) {
			error.value = "Failed to import layout";
			console.error(e);
		}
	};

	watch([user, projectContext], () => {
		fetchLayout();
		fetchAvailableSlots();
	}, { immediate: true });

	return {
		layout: readonly(layout),
		availableSlots: readonly(availableSlots),
		activeSlots,
		hiddenSlots,
		pinnedSlots,
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchLayout,
		fetchAvailableSlots,
		updateSlotVisibility,
		updateSlotOrder,
		updateSlotCustomization,
		toggleSlotPin,
		saveLayout,
		resetToDefaults,
		applyTemplate,
		exportLayout,
		importLayout,
	};
};
