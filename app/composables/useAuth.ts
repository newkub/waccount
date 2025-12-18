import type { User } from "~/shared/types";

interface FetchError {
	data?: { message?: string };
	status?: number;
	message?: string;
	statusText?: string;
}

/**
 * Auth composable - Pure Vue/Nuxt approach
 * - Uses Vue reactivity system
 * - Leverages Nuxt composables (useAsyncData, useFetch)
{{ ... }}
 * - Simple error handling with try-catch
 */
export const useAuth = () => {
	const user = useState<User | null>("user", () => null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const success = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	/**
	 * Clear all messages
	 */
	const clearMessages = () => {
		error.value = null;
		success.value = null;
	};

	const _callAuthApi = async <T>(
		apiCall: () => Promise<T>,
		options: {
			successMessage?: string;
			errorMessage: string;
			onSuccess?: (result: T) => void | Promise<void>;
			onError?: () => void | Promise<void>;
		},
	) => {
		try {
			loading.value = true;
			clearMessages();

			const result = await apiCall();

			if (options.onSuccess) {
				await options.onSuccess(result);
			}

			if (options.successMessage) {
				success.value = options.successMessage;
			}

			return result;
		} catch (err: unknown) {
			const fetchError = err as FetchError;
			error.value =
				fetchError?.data?.message ||
				fetchError?.message ||
				options.errorMessage;
			if (options.onError) {
				await options.onError();
			}
			throw err; // Re-throw to allow component-level handling
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Sign in with email and password
	 */
	const signInWithPassword = (email: string, password: string) =>
		_callAuthApi(
			() =>
				$fetch<{ user: User }>(
					"/api/auth/workos/password",
					{
						method: "POST",
						body: { email, password },
					},
				),
			{
				successMessage: "Signed in successfully",
				errorMessage: "Failed to sign in",
				onSuccess: async (response) => {
					user.value = response.user;
					await navigateTo("/profile");
				},
			},
		);

	/**
	 * Sign up with email and password
	 */
	const signUp = (
		email: string,
		password: string,
		userData?: { firstName?: string; lastName?: string },
	) =>
		_callAuthApi(
			() =>
				$fetch("/api/auth/workos/register", {
					method: "POST",
					body: {
						email,
						password,
						...userData,
					},
				}),
			{
				successMessage:
					"Account created successfully. Please check your email for verification.",
				errorMessage: "Failed to create account",
			},
		);

	/**
	 * Sign in with OAuth provider
	 */
	const signInWithProvider = (provider: string) =>
		_callAuthApi(
			() => $fetch<{ authorizationUrl: string }>(`/api/auth/workos/authorize/${provider}`),
			{
				errorMessage: `Failed to sign in with ${provider}`,
				onSuccess: (response) => {
					window.location.href = response.authorizationUrl;
				},
			},
		);

	/**
	 * Send magic link for passwordless auth
	 */
	const signInWithMagicLink = (email: string) =>
		_callAuthApi(() => $fetch("/api/auth/workos/magic-link", { method: "POST", body: { email } }), {
			successMessage: "Magic link sent to your email. Please check your inbox.",
			errorMessage: "Failed to send magic link",
		});

	/**
	 * Verify magic link token
	 */
	const verifyMagicLink = (token: string) =>
		_callAuthApi(
			() =>
				$fetch<{ user: User }>("/api/auth/workos/verify-magic-link", {
					method: "POST",
					body: { token },
				}),
			{
				errorMessage: "Invalid or expired magic link",
				onSuccess: async (response) => {
					user.value = response.user;
					await navigateTo("/profile");
				},
			},
		);

	/**
	 * Verify email with token
	 */
	const verifyEmail = (token: string) =>
		_callAuthApi(() => $fetch("/api/auth/workos/verify-email", { method: "POST", body: { token } }), {
			successMessage: "Email verified successfully",
			errorMessage: "Failed to verify email",
			onSuccess: () => {
				if (user.value) {
					user.value.emailVerified = true;
				}
			},
		});

	/**
	 * Resend verification email
	 */
	const resendVerificationEmail = () => {
		if (!user.value) {
			error.value = "No user logged in";
			return Promise.reject(new Error("No user logged in"));
		}
		return _callAuthApi(
			() =>
				$fetch(`/api/auth/workos/resend-verification/${user.value!.id}`, {
					method: "POST",
				}),
			{
				successMessage: "Verification email sent",
				errorMessage: "Failed to resend verification email",
			},
		);
	};

	/**
	 * Sign out
	 */
	const signOut = () =>
		_callAuthApi(() => $fetch("/api/auth/workos/logout", { method: "POST" }), {
			successMessage: "Signed out successfully",
			errorMessage: "Sign out failed", // Should not happen often
			onSuccess: async () => {
				user.value = null;
				await navigateTo("/");
			},
			onError: async () => {
				// Still clear user and redirect on failure
				user.value = null;
				await navigateTo("/");
			},
		});

	/**
	 * Refresh user data using simple fetch approach
	 */
	const refreshUser = () =>
		_callAuthApi(() => $fetch<{ user: User }>("/api/auth/workos/refresh"), {
			errorMessage: "Failed to refresh user",
			onSuccess: (response) => {
				user.value = response.user || null;
			},
			onError: () => {
				user.value = null;
			},
		});

	/**
	 * Request password reset
	 */
	const resetPassword = (email: string) =>
		_callAuthApi(() => $fetch("/api/auth/workos/reset-password", { method: "POST", body: { email } }), {
			successMessage: "Password reset email sent",
			errorMessage: "Failed to send reset email",
		});

	/**
	 * Update password
	 */
	const updatePassword = (currentPassword: string, newPassword: string) =>
		_callAuthApi(
			() =>
				$fetch("/api/auth/workos/update-password", {
					method: "POST",
					body: { currentPassword, newPassword },
				}),
			{
				successMessage: "Password updated successfully",
				errorMessage: "Failed to update password",
			},
		);

	/**
	 * Set user directly (for OAuth callback)
	 */
	const setUser = (newUser: User | null) => {
		user.value = newUser;
	};

	return {
		// State
		user,
		loading: readonly(loading),
		error: readonly(error),
		success: readonly(success),
		isAuthenticated,

		// Methods
		signInWithPassword,
		signUp,
		signInWithProvider,
		signInWithMagicLink,
		verifyMagicLink,
		verifyEmail,
		resendVerificationEmail,
		signOut,
		refreshUser,
		resetPassword,
		updatePassword,
		clearMessages,
		setUser,
	};
};
