import type { UserProfile, UpdateProfileData } from '#shared/types';

/**
 * User Management composable - Pure Vue/Nuxt approach
 * - Uses Vue reactivity system
 * - Leverages Nuxt composables
 * - Simple async/await patterns
 */
export const useUserManagement = () => {
	const profile = ref<UserProfile | null>(null);
	const loading = ref(false);
	const updating = ref(false);
	const error = ref<string | null>(null);
	const success = ref<string | null>(null);

	/**
	 * Clear messages
	 */
	const clearMessages = () => {
		error.value = null;
		success.value = null;
	};

	/**
	 * Fetch user profile using Nuxt's useAsyncData
	 */
	const fetchUserProfile = async (userId?: string) => {
		const endpoint = userId
			? `/api/users/${userId}`
			: "/api/auth/workos/profile";

		const { data, error: fetchError } = await useAsyncData(
			`user-profile-${userId || "me"}`,
			() => $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint),
			{
				lazy: true,
				server: false,
			},
		);

		if (fetchError.value) {
			error.value = fetchError.value?.message || "Failed to fetch profile";
			throw fetchError.value;
		}

		if (data.value) {
			profile.value = data.value.profile || data.value.user || null;
			return data.value.profile || data.value.user;
		}

		return null;
	};

	/**
	 * Update user profile data
	 */
	const updateUserProfile = async (data: UpdateProfileData) => {
		try {
			updating.value = true;
			error.value = null;

			const response = await $fetch<{ profile: UserProfile }>(
				"/api/auth/workos/profile",
				{
					method: "PATCH",
					body: data,
				},
			);

			profile.value = response.profile;
			success.value = "Profile updated successfully";
			return response.profile;
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to update profile";
			throw err;
		} finally {
			updating.value = false;
		}
	};

	/**
	 * Upload user avatar
	 */
	const uploadUserAvatar = async (file: File) => {
		try {
			updating.value = true;
			error.value = null;

			const formData = new FormData();
			formData.append("avatar", file);

			const response = await $fetch<{ avatarUrl: string }>(
				"/api/auth/workos/profile/avatar",
				{
					method: "POST",
					body: formData,
				},
			);

			if (profile.value) {
				profile.value = {
					...profile.value,
					avatar: response.avatarUrl,
				};
			}

			success.value = "Profile picture uploaded successfully";
			return response.avatarUrl;
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to upload profile picture";
			throw err;
		} finally {
			updating.value = false;
		}
	};

	/**
	 * Delete user account
	 */
	const deleteAccount = async () => {
		try {
			loading.value = true;
			error.value = null;

			await $fetch("/api/auth/workos/account", {
				method: "DELETE",
			});

			profile.value = null;
			success.value = "Account deleted successfully";
			await navigateTo("/");
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to delete account";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Get user activities
	 */
	const getUserActivities = async () => {
		try {
			loading.value = true;
			error.value = null;

			const response = await $fetch<{ activities: any[] }>(
				"/api/auth/workos/activities",
			);
			return response.activities;
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to fetch activities";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Update email
	 */
	const updateEmail = async (newEmail: string) => {
		try {
			updating.value = true;
			error.value = null;

			await $fetch("/api/auth/workos/email", {
				method: "PATCH",
				body: { email: newEmail },
			});

			success.value =
				"Email update request sent. Please check your new email for verification.";
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to update email";
			throw err;
		} finally {
			updating.value = false;
		}
	};

	return {
		// State
		profile: readonly(profile),
		loading: readonly(loading),
		updating: readonly(updating),
		error: readonly(error),
		success: readonly(success),

		// Methods
		fetchUserProfile,
		updateUserProfile,
		uploadUserAvatar,
		deleteAccount,
		getUserActivities,
		updateEmail,
		clearMessages,
	};
};
