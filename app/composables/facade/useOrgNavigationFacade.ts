import { storeToRefs } from "pinia";
import { useOrgService } from "~/composables/services/useOrgService";
import { useOrgStore } from "~/stores/org";

export const useOrgNavigationFacade = () => {
	const orgStore = useOrgStore();
	const { navItems, isMobileMenuOpen } = storeToRefs(orgStore);
	const service = useOrgService();
	const route = useRoute();

	const org = computed(() => String(route.params.org ?? ""));

	// Fetch layout data and update the store
	const { data, pending, error } = service.fetchDashboardLayout(org.value);
	watch(data, (newData) => {
		orgStore.layoutData = newData ?? null;
	}, { immediate: true });

	watch(pending, (newPending) => {
		orgStore.loading = newPending;
	});

	watch(error, (newError) => {
		orgStore.error = newError?.message || null;
	});

	const currentTab = computed(() => {
		if (route.path.endsWith("/integrations")) return "integrations";
		if (route.path.endsWith("/members")) return "members";
		if (route.path.endsWith("/audit-logs")) return "audit-logs";
		if (route.path.endsWith("/settings")) return "settings";
		return navItems.value[0]?.id ?? "integrations";
	});

	watch(
		() => route.fullPath,
		() => {
			isMobileMenuOpen.value = false;
		},
	);

	return {
		org,
		navItems,
		currentTab,
		isMobileMenuOpen,
		loading: pending,
		error,
	};
};
