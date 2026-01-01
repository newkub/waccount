import { useAuth } from "~/composables/facade/useAuth";

export const useAccountNavigationFacade = () => {
	const route = useRoute();
	const { user } = useAuth();

	const accountHref = computed(() => {
		if (!user.value) return "/";
		// The handle is now part of the route params
		const userParam = route.params.user;
		if (typeof userParam === "string") {
			return `/${userParam}`;
		}
		return "/";
	});

	const navItems = [
		{
			id: "account",
			label: "Dashboard",
			icon: "mdi:view-dashboard",
			href: () => accountHref.value,
		},
		{
			id: "settings",
			label: "Settings",
			icon: "mdi:cog",
			href: () => `${accountHref.value}/settings`,
		},
	];

	const currentTab = computed(() => {
		if (route.path.includes("/settings")) {
			return "settings";
		}
		// The main account page is now the dashboard
		return "account";
	});

	const isMobileMenuOpen = ref(false);

	watch(
		() => route.path,
		() => {
			isMobileMenuOpen.value = false;
		},
	);

	return {
		currentTab,
		navItems,
		isMobileMenuOpen,
	};
};
