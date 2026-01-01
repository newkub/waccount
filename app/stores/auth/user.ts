import type { UpdateProfileData, User, UserProfile } from "#shared/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
	// State
	const user = ref<UserProfile | null>(null);
	const loading = ref(false);
	const updating = ref(false);

	// Getters
	const isLoggedIn = computed(() => !!user.value);
	const currentUser = computed(() => user.value);
	const isAuthenticated = computed(() => isLoggedIn.value);

	// Actions
	function setUser(newUser: User | null) {
		user.value = newUser;
	}

	function logout() {
		user.value = null;
	}

	async function fetchUserProfile(userId?: string) {
		const endpoint = userId ? `/api/users/${userId}` : "/api/auth/workos/profile";
		loading.value = true;
		try {
			const response = await $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint);
			user.value = response.profile || response.user || null;
			return user.value;
		} finally {
			loading.value = false;
		}
	}

	async function updateUserProfile(data: UpdateProfileData) {
		updating.value = true;
		try {
			const response = await $fetch<{ profile: UserProfile }>("/api/auth/workos/profile", {
				method: "PATCH",
				body: data,
			});
			user.value = response.profile;
			return response.profile;
		} finally {
			updating.value = false;
		}
	}

	async function uploadUserAvatar(file: File) {
		updating.value = true;
		try {
			const formData = new FormData();
			formData.append("avatar", file);
			const response = await $fetch<{ avatarUrl: string }>("/api/auth/workos/profile/avatar", {
				method: "POST",
				body: formData,
			});
			if (user.value) {
				user.value.avatar = response.avatarUrl;
			}
			return response.avatarUrl;
		} finally {
			updating.value = false;
		}
	}

	async function deleteAccount() {
		loading.value = true;
		try {
			await $fetch("/api/auth/workos/account", { method: "DELETE" });
			user.value = null;
			await navigateTo("/");
		} finally {
			loading.value = false;
		}
	}

	async function getUserActivities() {
		loading.value = true;
		try {
			const response = await $fetch<{ activities: any[] }>("/api/auth/workos/activities");
			return response.activities;
		} finally {
			loading.value = false;
		}
	}

	async function updateEmail(newEmail: string) {
		updating.value = true;
		try {
			await $fetch("/api/auth/workos/email", {
				method: "PATCH",
				body: { email: newEmail },
			});
		} finally {
			updating.value = false;
		}
	}

	async function resendVerificationEmail() {
		// Implement logic to resend verification email
	}

	return {
		// State
		user,
		loading,
		updating,
		// Getters
		isLoggedIn,
		currentUser,
		isAuthenticated,
		// Actions
		setUser,
		logout,
		fetchUserProfile,
		updateUserProfile,
		uploadUserAvatar,
		deleteAccount,
		getUserActivities,
		updateEmail,
		resendVerificationEmail,
	};
});
