import type { AccountOrganization, UserPreferences } from "#shared/types";

export const useAccountService = () => {
	const fetchAccountData = async () => {
		const { data: profileResponse } = await useFetch("/api/auth/workos/profile");
		const { data: organizationsResponse } = await useFetch("/api/users/me/organizations");

		const organizations: AccountOrganization[] = Array.isArray(organizationsResponse.value)
			? (organizationsResponse.value as AccountOrganization[])
			: [];
		const preferences = profileResponse.value?.user?.preferences ?? {
			emailNotifications: true,
			marketingEmails: false,
			twoFactorEnabled: false,
		};

		return {
			organizations,
			preferences,
		};
	};

	const updatePreference = async (key: keyof UserPreferences, value: any) => {
		return await useFetch("/api/auth/workos/profile", {
			method: "PATCH",
			body: { preferences: { [key]: value } },
		});
	};

	const deleteAccount = async () => {
		return await useFetch("/api/auth/workos/account", {
			method: "DELETE",
		});
	};

	const enrollTwoFactor = async () => {
		return await useFetch("/api/auth/mfa/enroll", {
			method: "POST",
		});
	};

	const verifyTwoFactor = async (factorId: string, code: string) => {
		return await useFetch("/api/auth/mfa/verify", {
			method: "POST",
			body: { factorId, code },
		});
	};

	return {
		fetchAccountData,
		updatePreference,
		deleteAccount,
		enrollTwoFactor,
		verifyTwoFactor,
	};
};
