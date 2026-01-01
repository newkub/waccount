/**
 * Authentication middleware
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to the login page
 */
import { useAuth } from "~/composables/facade/useAuth";

export default defineNuxtRouteMiddleware((to) => {
	// Public pages that do not require authentication
	const publicPages = [
		"/",
		"/auth/login",
		"/auth/signup",
		"/auth/reset-password",
	];

	// Skip middleware if the page is public
	if (publicPages.some(page => to.path.startsWith(page))) {
		return;
	}

	const { isAuthenticated } = useAuth();

	// If user is not authenticated, redirect to login page
	if (!isAuthenticated.value) {
		return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
	}
});
