import type { UpdateProfileData, UserProfile } from "#shared/types";
import { defineStore } from "pinia";

import { useUserService } from "~/composables/services/userService";
import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", () => {
	const user = ref<UserProfile | null>(null);
	const loading = ref(false);
	const updating = ref(false);

	const isAuthenticated = computed(() => !!user.value);

	const setUser = (newUser: UserProfile | null) => {
		user.value = newUser;
	};

	const apiHandler = useApiHandler(loading);
	const updatingApiHandler = useApiHandler(updating);
	const userService = useUserService();

	const fetchUserProfile = (userId?: string) =>
		apiHandler.handle(() => userService.fetchUserProfile(userId), {
			errorMessage: "Failed to fetch profile",
			onSuccess: (result) => {
				const userProfile = result?.profile || result?.user || null;
				user.value = userProfile;
			},
		});

	const updateUserProfile = (data: UpdateProfileData) =>
		updatingApiHandler.handle(() => userService.updateUserProfile(data), {
			successMessage: "Profile updated successfully",
			errorMessage: "Failed to update profile",
			onSuccess: (result) => {
				if (result) user.value = result.profile;
			},
		});

	const uploadUserAvatar = (file: File) =>
		updatingApiHandler.handle(() => userService.uploadUserAvatar(file), {
			successMessage: "Profile picture uploaded successfully",
			errorMessage: "Failed to upload profile picture",
			onSuccess: (result) => {
				if (result && user.value) {
					user.value.avatar = result.avatarUrl;
				}
			},
		});

	const deleteAccount = () =>
		apiHandler.handle(() => userService.deleteAccount(), {
			successMessage: "Account deleted successfully",
			errorMessage: "Failed to delete account",
			onSuccess: async () => {
				const authStore = useAuthStore();
				await authStore.signOut();
			},
		});

	const getUserActivities = () =>
		apiHandler.handle(() => userService.getUserActivities(), {
			errorMessage: "Failed to fetch activities",
		});

	const resendVerificationEmail = () =>
		apiHandler.handle(() => userService.resendVerificationEmail(), {
			successMessage: "Verification email has been sent.",
			errorMessage: "Failed to send verification email.",
		});

	const updateEmail = (newEmail: string) =>
		updatingApiHandler.handle(() => userService.updateEmail(newEmail), {
			successMessage: "Email update request sent. Please check your new email for verification.",
			errorMessage: "Failed to update email",
		});

	return {
		user,
		loading,
		updating,
		isAuthenticated,
		setUser,
		fetchUserProfile,
		updateUserProfile,
		uploadUserAvatar,
		deleteAccount,
		getUserActivities,
		updateEmail,
		resendVerificationEmail,
	};
});
