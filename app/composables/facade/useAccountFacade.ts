import { storeToRefs } from 'pinia';
import { useAccountStore } from '~/stores/account';
import { useAccountService } from '~/composables/services/useAccountService';
import type { UserPreferences } from '~/shared/types';

export const useAccountFacade = () => {
  const accountStore = useAccountStore();
  const { preferences, organizations, loading, error, isOrganizationAdmin } = storeToRefs(accountStore);
  const service = useAccountService();

  const fetchAccountData = async () => {
    accountStore.loading = true;
    accountStore.error = null;
    try {
      const data = await service.fetchAccountData();
      accountStore.organizations = data.organizations;
      accountStore.preferences = data.preferences;
    } catch (e: any) {
      accountStore.error = e.message || 'Failed to fetch account data';
    } finally {
      accountStore.loading = false;
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    accountStore.loading = true;
    accountStore.error = null;
    try {
      await service.updatePreference(key, value);
      if (accountStore.preferences) {
        accountStore.preferences[key] = value;
      }
    } catch (e: any) {
      accountStore.error = e.message || 'Failed to update preference';
    } finally {
      accountStore.loading = false;
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    accountStore.loading = true;
    accountStore.error = null;
    try {
      await service.deleteAccount();
      // Handle successful deletion, e.g., sign out and redirect
    } catch (e: any) {
      accountStore.error = e.message || 'Failed to delete account';
    } finally {
      accountStore.loading = false;
    }
  };

  const enableTwoFactor = async () => {
    accountStore.loading = true;
    accountStore.error = null;
    try {
      await service.enableTwoFactor();
      if (accountStore.preferences) {
        accountStore.preferences.twoFactorEnabled = true;
      }
    } catch (e: any) {
      accountStore.error = e.message || 'Failed to enable 2FA';
    } finally {
      accountStore.loading = false;
    }
  };

  return {
    // State from store
    preferences,
    organizations,
    loading,
    error,
    isOrganizationAdmin,

    // Actions
    fetchAccountData,
    updatePreference,
    deleteAccount,
    enableTwoFactor,
  };
};
