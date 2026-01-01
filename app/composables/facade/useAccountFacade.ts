import type { UserPreferences } from "#shared/types";
import { storeToRefs } from "pinia";
import { useAccountService } from "~/composables/services/useAccountService";
import { useAccountStore } from "~/stores/account";

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
			accountStore.preferences = data.preferences ?? null;
		} catch (e: any) {
			accountStore.error = e.message || "Failed to fetch account data";
		} finally {
			accountStore.loading = false;
		}
	};

	const updatePreference = async (key: keyof UserPreferences, value: any) => {
		accountStore.loading = true;
		accountStore.error = null;
		try {
			await service.updatePreference(key, value);
			if (preferences.value) {
				(preferences.value[key] as any) = value;
			}
		} catch (e: any) {
			accountStore.error = e.message || "Failed to update preference";
		} finally {
			accountStore.loading = false;
		}
	};

	const deleteAccount = async () => {
		if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
			return;
		}
		accountStore.loading = true;
		accountStore.error = null;
		try {
			await service.deleteAccount();
			// Handle successful deletion, e.g., sign out and redirect
		} catch (e: any) {
			accountStore.error = e.message || "Failed to delete account";
		} finally {
			accountStore.loading = false;
		}
	};

	const enableTwoFactor = async () => {
		accountStore.loading = true;
		accountStore.error = null;
		try {
			await service.enrollTwoFactor();
			if (accountStore.preferences) {
				accountStore.preferences.twoFactorEnabled = true;
			}
		} catch (e: any) {
			accountStore.error = e.message || "Failed to enable 2FA";
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
