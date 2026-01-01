import { defineStore } from 'pinia';
import type { NavItem } from '~/composables/core/useWorkspaceNavigation';
import type { OrgDashboardLayoutResponse } from '#shared/types';

export const useOrgStore = defineStore('org', () => {
  const layoutData = ref<OrgDashboardLayoutResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isMobileMenuOpen = ref(false);

  const navItemsBase = (orgId: string): NavItem[] => [
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'mdi:link-variant',
      href: () => `/${orgId}/integrations`,
    },
    {
      id: 'members',
      label: 'Members',
      icon: 'mdi:account-multiple-outline',
      href: () => `/${orgId}/members`,
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: 'mdi:clipboard-text-outline',
      href: () => `/${orgId}/audit-logs`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'mdi:cog-outline',
      href: () => `/${orgId}/settings`,
    },
  ];

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
    const orgId = useRoute().params.org as string;
    if (!orgId) return [];
    const baseItems = navItemsBase(orgId);
    const hidden = hiddenTabIds.value;
    if (hidden.size === 0) return baseItems;
    return baseItems.filter((item) => !hidden.has(item.id));
  });

  return {
    layoutData,
    loading,
    error,
    isMobileMenuOpen,
    navItems,
  };
});
