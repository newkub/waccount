/**
 * Guest middleware
 * - Prevents authenticated users from accessing auth pages
 * - Redirects authenticated users to account page
 */
import { useAuth } from '~/composables/auth';

export default defineNuxtRouteMiddleware((to) => {
	// Only apply to auth pages
	const authPages = [
		"/auth/signin",
		"/auth/reset-password",
		"/auth/forgot-password"
	];
	const isAuthPage = authPages.includes(to.path);

	if (!isAuthPage) {
		return;
	}

	// Check if user is already authenticated
		const { isAuthenticated } = useAuth();

	if (isAuthenticated.value) {
		// Redirect to account page or intended page
		const redirectTo = (to.query.redirect as string) || "/account";
		return navigateTo(redirectTo);
	}
});
