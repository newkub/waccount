import type { LoginFormData, RegisterFormData } from "#shared/types/auth";
import { storeToRefs } from "pinia";
import { useFeedback } from "~/composables/core/useFeedback";
import { useAuthStore } from "~/stores/auth";
import { useUserStore } from "~/stores/user";

/**
 * @module useAuth
 * @description A facade composable that provides a unified interface for authentication.
 * It exposes state and actions from the `useAuthStore` and `useUserStore`.
 * This makes it easy for components to interact with the authentication system
 * without needing to know the implementation details of Pinia.
 */
export const useAuth = () => {
	const authStore = useAuthStore();
	const userStore = useUserStore();

	const { loading, error, success } = storeToRefs(authStore);
	const { user, isAuthenticated } = storeToRefs(userStore);

	const signInWithPassword = (credentials: LoginFormData) => {
		return authStore.signInWithPassword(credentials);
	};

	const signUp = (data: RegisterFormData) => {
		return authStore.signUp(data);
	};

	const { showError, showSuccess } = useFeedback();
	watch(error, (newError) => {
		if (newError) showError(newError);
	});
	watch(success, (newSuccess) => {
		if (newSuccess) showSuccess(newSuccess);
	});

	return {
		// State
		user: readonly(user),
		loading: readonly(loading),
		isAuthenticated: readonly(isAuthenticated),

		// Actions
		clearMessages: authStore.clearMessages,
		setUser: userStore.setUser,
		signInWithPassword,
		signUp,
		signInWithOAuth: authStore.signInWithOAuth,
		startAuthKit: authStore.startAuthKit,
		requestPasswordReset: authStore.requestPasswordReset,
		resetPassword: authStore.resetPassword,
		signOut: authStore.signOut,
		refreshUser: authStore.refreshUser,
	};
};
