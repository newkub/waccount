import { defineStore } from "pinia";
import type { Activity, UpdateProfileData, UserProfile } from "../../shared/types";

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

	const fetchUserProfile = (userId?: string) => {
		const endpoint = userId
			? `/api/users/${userId}`
			: "/api/auth/workos/profile";
		return apiHandler.handle<{ profile?: UserProfile; user?: UserProfile }>(
			() => $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint),
			{
				errorMessage: "Failed to fetch profile",
				onSuccess: (result: { profile?: UserProfile; user?: UserProfile }) => {
					const userProfile = result?.profile || result?.user || null;
					user.value = userProfile;
				},
			},
		);
	};

	const updateUserProfile = (data: UpdateProfileData) =>
		updatingApiHandler.handle<{ profile: UserProfile }>(
			() =>
				$fetch<{ profile: UserProfile }>("/api/auth/workos/profile", {
					method: "PATCH",
					body: data,
				}),
			{
				successMessage: "Profile updated successfully",
				errorMessage: "Failed to update profile",
				onSuccess: (result: { profile: UserProfile } | null) => {
					if (result) user.value = result.profile;
				},
			},
		);

	const uploadUserAvatar = (file: File) => {
		const formData = new FormData();
		formData.append("avatar", file);
		return updatingApiHandler.handle<{ avatarUrl: string }>(
			() =>
				$fetch<{ avatarUrl: string }>("/api/auth/workos/profile/avatar", {
					method: "POST",
					body: formData,
				}),
			{
				successMessage: "Profile picture uploaded successfully",
				errorMessage: "Failed to upload profile picture",
				onSuccess: (result: { avatarUrl: string } | null) => {
					if (result && user.value) {
						user.value.avatar = result.avatarUrl;
					}
				},
			},
		);
	};

	const deleteAccount = () =>
		apiHandler.handle<{ success: boolean }>(
			() => $fetch("/api/auth/workos/account", { method: "DELETE" }),
			{
				successMessage: "Account deleted successfully",
				errorMessage: "Failed to delete account",
				onSuccess: async () => {
					const authStore = useAuthStore();
					authStore.signOut();
				},
			},
		);

	const getUserActivities = () =>
		apiHandler.handle<{ activities: Activity[] }>(
			() => $fetch<{ activities: Activity[] }>("/api/auth/workos/activities"),
			{ errorMessage: "Failed to fetch activities" },
		);

	const resendVerificationEmail = () =>
		apiHandler.handle(
			() => $fetch("/api/auth/workos/verify-email", { method: "POST" }),
			{
				successMessage: "Verification email has been sent.",
				errorMessage: "Failed to send verification email.",
			},
		);

	const updateEmail = (newEmail: string) =>
		updatingApiHandler.handle<{ success: boolean }>(
			() =>
				$fetch("/api/auth/workos/email", {
					method: "PATCH",
					body: { email: newEmail },
				}),
			{
				successMessage: "Email update request sent. Please check your new email for verification.",
				errorMessage: "Failed to update email",
			},
		);

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
