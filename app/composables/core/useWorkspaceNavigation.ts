export interface NavItem {
	id: string;
	label: string;
	icon: string;
	href: (accountId?: string) => string;
}

export const useWorkspaceNavigation = () => {
	const route = useRoute();

	const org = computed(() => String(route.params.org ?? ""));
	const project = computed(() => String(route.params.project ?? ""));

	const navItems: NavItem[] = [
		{
			id: "overview",
			label: "Overview",
			icon: "mdi:view-dashboard-outline",
			href: () => {
				if (org.value && project.value) return `/${org.value}/${project.value}`;
				if (project.value) return `/${project.value}`;
				return "/";
			},
		},
		{
			id: "members",
			label: "Members",
			icon: "mdi:account-multiple-outline",
			href: () => {
				if (org.value && project.value) {
					return `/${org.value}/${project.value}?tab=members`;
				}
				if (project.value) return `/${project.value}?tab=members`;
				return "/";
			},
		},
		{
			id: "settings",
			label: "Project Settings",
			icon: "mdi:cog-outline",
			href: () => {
				if (org.value && project.value) {
					return `/${org.value}/${project.value}?tab=settings`;
				}
				if (project.value) return `/${project.value}?tab=settings`;
				return "/";
			},
		},
	];

	const currentTab = computed(() => {
		const tabQuery = route.query.tab;
		if (typeof tabQuery === "string" && tabQuery) return tabQuery;
		return "overview";
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
		project,
		navItems,
		currentTab,
		isMobileMenuOpen,
	};
};
