import type { NavItem, OrgDashboardLayoutResponse } from "#shared/types";

export const useOrgNavigation = () => {
	const route = useRoute();

	const org = computed(() => String(route.params.org ?? ""));

	const navItemsBase: NavItem[] = [
		{
			id: "integrations",
			label: "Integrations",
			icon: "mdi:link-variant",
			href: () => `/${org.value}/integrations`,
		},
		{
			id: "members",
			label: "Members",
			icon: "mdi:account-multiple-outline",
			href: () => `/${org.value}/members`,
		},
		{
			id: "audit-logs",
			label: "Audit Logs",
			icon: "mdi:clipboard-text-outline",
			href: () => `/${org.value}/audit-logs`,
		},
		{
			id: "settings",
			label: "Settings",
			icon: "mdi:cog-outline",
			href: () => `/${org.value}/settings`,
		},
	];

	const { data: layoutData } = useFetch<OrgDashboardLayoutResponse>(
		() => `/api/orgs/${org.value}/dashboard-layout`,
		{
			watch: [org],
		},
	);

	const hiddenTabIds = computed(() => {
		const tabs = layoutData.value?.layout?.tabs;
		if (!tabs) return new Set<string>();
		return new Set(
			tabs
				.filter((t) => t.hidden)
				.map((t) => t.id),
		);
	});

	const navItems = computed(() => {
		const hidden = hiddenTabIds.value;
		if (hidden.size === 0) return navItemsBase;
		return navItemsBase.filter((item) => !hidden.has(item.id));
	});

	const currentTab = computed(() => {
		if (route.path.endsWith("/integrations")) return "integrations";
		if (route.path.endsWith("/members")) return "members";
		if (route.path.endsWith("/audit-logs")) return "audit-logs";
		if (route.path.endsWith("/settings")) return "settings";
		return navItems.value[0]?.id ?? "integrations";
	});

	const isMobileMenuOpen = ref(false);
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
	};
};
