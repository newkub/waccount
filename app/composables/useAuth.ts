import type { User } from '~/types';



/**
 * Auth composable - Pure Vue/Nuxt approach
 * - Uses Vue reactivity system
 * - Leverages Nuxt composables (useAsyncData, useFetch)
{{ ... }}
 * - Simple error handling with try-catch
 */
export const useAuth = () => {
	const user = ref<User | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const success = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	// Initialize user on composable creation
	const initUser = async () => {
		try {
			const response = await $fetch<{ user: User }>("/api/auth/workos/refresh");
			if (response.user) {
				user.value = response.user;
			}
		} catch (error: any) {
			// Expected error when user is not authenticated
			// Don't log this error as it's expected behavior
			console.debug('User not authenticated:', error?.message || 'No session')
			user.value = null;
		}
	};

	// Initialize on first call
	onMounted(() => {
		initUser();
	});

	/**
	 * Clear all messages
	 */
	const clearMessages = () => {
		error.value = null;
		success.value = null;
	};

	/**
	 * Sign in with email and password
	 */
	const signInWithPassword = async (email: string, password: string) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await $fetch<{ user: User }>(
				"/api/auth/workos/password",
				{
					method: "POST",
					body: { email, password },
				},
			);

			user.value = response.user;
			success.value = "Signed in successfully";

			await navigateTo("/account");
			return response;
		} catch (err: any) {
			error.value = err?.data?.message || err?.message || "Failed to sign in";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Sign up with email and password
	 */
	const signUp = async (
		email: string,
		password: string,
		userData?: { firstName?: string; lastName?: string },
	) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await $fetch("/api/auth/workos/register", {
				method: "POST",
				body: {
					email,
					password,
					...userData,
				},
			});

			success.value =
				"Account created successfully. Please check your email for verification.";
			return response;
		} catch (err: any) {
			error.value =
				err?.data?.message || err?.message || "Failed to create account";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Sign in with OAuth provider
	 */
	const signInWithProvider = async (provider: string) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await $fetch<{ authorizationUrl: string }>(
				`/api/auth/workos/authorize/${provider}`,
			);

			window.location.href = response.authorizationUrl;
		} catch (err: any) {
			error.value = err?.data?.message || `Failed to sign in with ${provider}`;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Send magic link for passwordless auth
	 */
	const signInWithMagicLink = async (email: string) => {
		try {
			loading.value = true;
			error.value = null;

			await $fetch("/api/auth/workos/magic-link", {
				method: "POST",
				body: { email },
			});

			success.value = "Magic link sent to your email. Please check your inbox.";
			return { success: true };
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to send magic link";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// TODO: Implement these endpoints when needed
	// - verifyMagicLink (requires /api/auth/workos/verify-magic-link)
	// - verifyEmail (requires /api/auth/workos/verify-email)
	// - resendVerificationEmail (requires /api/auth/workos/resend-verification/:id)

	/**
	 * Sign out
	 */
	const signOut = async () => {
		try {
			loading.value = true;
			error.value = null;

			await $fetch("/api/auth/workos/logout", {
				method: "POST",
			});

			user.value = null;
			success.value = "Signed out successfully";
			await navigateTo("/");
		} catch (_err: any) {
			// Clear user even if API call fails
			user.value = null;
			await navigateTo("/");
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Refresh user data using simple fetch approach
	 */
	const refreshUser = async () => {
		try {
			loading.value = true;
			error.value = null;

			const response = await $fetch<{ user: User }>("/api/auth/workos/refresh");

			user.value = response.user || null;
			return response;
		} catch (err: any) {
			user.value = null;
			error.value = err?.data?.message || err?.message || "Failed to refresh user";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Request password reset
	 */
	const resetPassword = async (email: string) => {
		try {
			loading.value = true;
			error.value = null;

			await $fetch("/api/auth/workos/reset-password", {
				method: "POST",
				body: { email },
			});

			success.value = "Password reset email sent";
		} catch (err: any) {
			error.value = err?.data?.message || "Failed to send reset email";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// TODO: Implement updatePassword when endpoint is available
	// - updatePassword (requires /api/auth/workos/update-password)

	return {
		// State
		user: readonly(user),
		loading: readonly(loading),
		error: readonly(error),
		success: readonly(success),
		isAuthenticated,

		// Available Methods
		signInWithPassword,
		signUp,
		signInWithProvider,
		signInWithMagicLink,
		signOut,
		refreshUser,
		resetPassword,
		clearMessages,

		// TODO: Implement when endpoints are available
		// verifyMagicLink,
		// verifyEmail,
		// resendVerificationEmail,
		// updatePassword,
	};
};
