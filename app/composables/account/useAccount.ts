import type { AccountOrganization, UserPreferences } from "~/shared/types";

export const useAccount = () => {
	const loading = ref(false);
	const preferences = ref<UserPreferences>({
		emailNotifications: true,
		marketingEmails: false,
		twoFactorEnabled: false,
	});
	const organizations = ref<AccountOrganization[]>([]);

	const mockOrganizations: AccountOrganization[] = [
		{
			id: "org_123",
			name: "Wrikka Team",
			role: "admin",
			plan: "enterprise",
			memberCount: 15,
		},
	];

	const fetchAccountData = async () => {
		loading.value = true;
		organizations.value = mockOrganizations;
		// fetch preferences here
		loading.value = false;
	};

	const isOrganizationAdmin = computed(() => {
		return organizations.value.some(org => org.role === "admin");
	});

	const updatePreference = async (key: keyof UserPreferences, value: any) => {
		loading.value = true;
		console.log("Updating preference:", key, value);
		preferences.value[key] = value;
		loading.value = false;
	};

	const deleteAccount = async () => {
		if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
			return;
		}
		loading.value = true;
		console.log("Deleting account...");
		// await signOut() call should be in component
		loading.value = false;
	};

	const enableTwoFactor = async () => {
		loading.value = true;
		console.log("Enabling 2FA...");
		preferences.value.twoFactorEnabled = true;
		loading.value = false;
	};

	return {
		loading,
		preferences,
		organizations,
		fetchAccountData,
		isOrganizationAdmin,
		updatePreference,
		deleteAccount,
		enableTwoFactor,
	};
};
