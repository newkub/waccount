export const useAccountNavigation = () => {
  const route = useRoute();

  const navItems = [
    {
      id: "account",
      label: "Dashboard",
      icon: 'i-mdi-view-dashboard',
      href: "/account",
    },
    {
      id: "settings",
      label: "Settings",
      icon: 'i-mdi-cog',
      href: "/account/settings",
    },
  ];

  const currentTab = computed(() => {
    // Find the last part of the path, e.g., 'settings' from '/account/settings'
    const lastSegment = route.path.split('/').filter(Boolean).pop();
    // If it's just '/account', the last segment will be 'account'. Default to 'account' if something goes wrong.
    return lastSegment || "account";
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
