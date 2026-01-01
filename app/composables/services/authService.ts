import type { User } from "#shared/types";
import type { LoginFormData, RegisterFormData } from "#shared/types/auth";

export const useAuthService = () => {
	const signInWithPassword = (credentials: LoginFormData) => {
		return $fetch<{ user: User }>("/api/auth/workos/password", {
			method: "POST",
			body: credentials,
		});
	};

	const signUp = (data: RegisterFormData) => {
		return $fetch<{ user: User }>("/api/auth/workos/register", {
			method: "POST",
			body: data,
		});
	};

	const signInWithOAuth = (provider: string) => {
		return $fetch<{ authorizationUrl: string }>(
			`/api/auth/workos/authorize/${provider}`,
		);
	};

	const startAuthKit = () => {
		return $fetch<{ authorizationUrl: string }>("/api/auth/workos/authorize");
	};

	const requestPasswordReset = (email: string) => {
		return $fetch<{ success: boolean }>("/api/auth/workos/password-reset", {
			method: "POST",
			body: { email },
		});
	};

	const resetPassword = (token: string, newPassword: string) => {
		return $fetch<{ success: boolean }>("/api/auth/workos/reset-password", {
			method: "POST",
			body: { token, newPassword },
		});
	};

	const signOut = () => {
		return $fetch<{ success: boolean; logoutUrl?: string }>(
			"/api/auth/workos/logout",
			{ method: "POST" },
		);
	};

	const refreshUser = () => {
		return $fetch<{ user: User }>("/api/auth/workos/refresh");
	};

	const signInWithMagicLink = (email: string) => {
		return $fetch<{ success: boolean }>("/api/auth/workos/magic-link", {
			method: "POST",
			body: { email },
		});
	};

	return {
		signInWithPassword,
		signUp,
		signInWithOAuth,
		startAuthKit,
		requestPasswordReset,
		resetPassword,
		signOut,
		refreshUser,
		signInWithMagicLink,
	};
};
