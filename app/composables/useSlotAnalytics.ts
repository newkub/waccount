import type { SlotAnalytics } from "~/shared/types/slots";

export const useSlotAnalytics = () => {
	const user = useUser();
	const projectContext = useProjectContext();
	const { $fetch } = useNuxtApp();

	const analytics = ref<SlotAnalytics[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const trackSlotView = async (slotId: string) => {
		if (!user.value?.id) return;

		try {
			await $fetch("/api/slots/analytics/track", {
				method: "POST",
				body: {
					userId: user.value.id,
					slotId,
					projectContext: projectContext.value?.id,
				},
			});
		} catch (e) {
			console.error("Failed to track slot view:", e);
		}
	};

	const fetchAnalytics = async () => {
		if (!user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotAnalytics[]>("/api/slots/analytics", {
				query: {
					userId: user.value.id,
					projectContext: projectContext.value?.id,
				},
			});
			analytics.value = response;
		} catch (e) {
			error.value = "Failed to fetch analytics";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const getMostViewedSlots = (limit = 5) => {
		return computed(() => {
			return [...analytics.value]
				.sort((a, b) => b.viewCount - a.viewCount)
				.slice(0, limit);
		});
	};

	const getRecentlyViewedSlots = (limit = 5) => {
		return computed(() => {
			return [...analytics.value]
				.filter((a) => a.lastViewedAt)
				.sort((a, b) => {
					const aTime = new Date(a.lastViewedAt!).getTime();
					const bTime = new Date(b.lastViewedAt!).getTime();
					return bTime - aTime;
				})
				.slice(0, limit);
		});
	};

	const getSlotAnalytics = (slotId: string) => {
		return computed(() => {
			return analytics.value.find((a) => a.slotId === slotId);
		});
	};

	watch([user, projectContext], () => {
		if (user.value?.id) {
			fetchAnalytics();
		}
	}, { immediate: true });

	return {
		analytics: readonly(analytics),
		isLoading: readonly(isLoading),
		error: readonly(error),
		trackSlotView,
		fetchAnalytics,
		getMostViewedSlots,
		getRecentlyViewedSlots,
		getSlotAnalytics,
	};
};
