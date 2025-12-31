import { getUserHandle } from "#shared/utils/user-handle";
import { useAuth } from "~/composables/facade/useAuth";

export const useAccountNavigation = () => {
	const route = useRoute();
	const { user } = useAuth();

	const accountHref = computed(() => {
		if (!user.value) return "/";
		return `/${getUserHandle(user.value)}`;
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
		if (route.path.endsWith("/settings")) return "settings";
		return "profile";
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
