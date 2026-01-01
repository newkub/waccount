import { defineStore } from 'pinia';
import type { AccountOrganization, UserPreferences } from '~/shared/types';

export const useAccountStore = defineStore('account', () => {
  const preferences = ref<UserPreferences | null>(null);
  const organizations = ref<AccountOrganization[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isOrganizationAdmin = computed(() => {
    return organizations.value.some(org => org.role === 'admin');
  });

  return {
    preferences,
    organizations,
    loading,
    error,
    isOrganizationAdmin,
  };
});
