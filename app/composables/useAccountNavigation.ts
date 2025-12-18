export const useAccountNavigation = () => {
  const route = useRoute();

  const currentTab = computed(() => {
    const pathSegments = route.path.split("/");
    return pathSegments[pathSegments.length - 1] || "profile";
  });

  const navItems = [
    {
      id: "profile",
      label: "Profile",
      icon: 'i-mdi-account',
      href: (accountId: string) => `/${accountId}/profile`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: 'i-mdi-cog',
      href: (accountId: string) => `/${accountId}/settings`,
    },
  ];

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
