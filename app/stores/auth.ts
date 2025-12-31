import { defineStore } from "pinia";

import type { LoginFormData, RegisterFormData } from "#shared/types/auth";
import { useAuthService } from "~/composables/services/authService";
import { useUserStore } from "./user";

export const useAuthStore = defineStore("auth", () => {
	const userStore = useUserStore();
	const authService = useAuthService();
	const loading = ref(false);
	const error = ref<string | null>(null);
	const success = ref<string | null>(null);

	const clearMessages = () => {
		error.value = null;
		success.value = null;
	};

	const apiHandler = useApiHandler(loading, error, success);

	const signInWithPassword = (credentials: LoginFormData) =>
		apiHandler.handle(() => authService.signInWithPassword(credentials), {
			successMessage: "Signed in successfully",
			errorMessage: "Failed to sign in",
			onSuccess: async (response) => {
				userStore.setUser(response.user);
			},
		});

	const signUp = (data: RegisterFormData) =>
		apiHandler.handle(() => authService.signUp(data), {
			successMessage: "Account created. Please check your email for verification.",
			errorMessage: "Failed to create account",
			onSuccess: async (response) => {
				userStore.setUser(response.user);
			},
		});

	const signInWithOAuth = (provider: string) =>
		apiHandler.handle(() => authService.signInWithOAuth(provider), {
			errorMessage: `Failed to sign in with ${provider}`,
			onSuccess: (response) => {
				window.location.href = response.authorizationUrl;
			},
		});

	const startAuthKit = () =>
		apiHandler.handle(() => authService.startAuthKit(), {
			errorMessage: "Failed to start sign in",
			onSuccess: (response) => {
				window.location.href = response.authorizationUrl;
			},
		});

	const requestPasswordReset = (email: string) =>
		apiHandler.handle(() => authService.requestPasswordReset(email), {
			successMessage: "If the email exists, we'll send a reset link.",
			errorMessage: "Failed to request password reset",
		});

	const resetPassword = (token: string, newPassword: string) =>
		apiHandler.handle(() => authService.resetPassword(token, newPassword), {
			successMessage: "Password updated. You can sign in now.",
			errorMessage: "Failed to reset password",
		});

	const signOut = () =>
		apiHandler.handle(() => authService.signOut(), {
			successMessage: "Signed out successfully",
			errorMessage: "Sign out failed",
			onSuccess: async (response) => {
				userStore.setUser(null);
				if (response.logoutUrl) {
					window.location.href = response.logoutUrl;
					return;
				}
				await navigateTo("/");
			},
			onError: async () => {
				userStore.setUser(null);
				await navigateTo("/");
			},
		});

	const refreshUser = () =>
		apiHandler.handle(() => authService.refreshUser(), {
			errorMessage: "Failed to refresh user session",
			onSuccess: (response) => {
				userStore.setUser(response.user);
			},
			onError: () => {
				userStore.setUser(null);
			},
		});

	return {
		loading,
		error,
		success,
		clearMessages,
		signInWithPassword,
		signUp,
		signInWithOAuth,
		startAuthKit,
		requestPasswordReset,
		resetPassword,
		signOut,
		refreshUser,
	};
});
