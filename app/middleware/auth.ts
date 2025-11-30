/**
 * Authentication middleware
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to sign-in page
 */
export default defineNuxtRouteMiddleware((to) => {
	// Skip middleware for public pages
	const publicPages = [
		"/",
		"/auth/signin",
		"/auth/reset-password",
		"/auth/forgot-password",
		"/auth/magic-link"
	];
	const isPublicPage = publicPages.some(page => to.path.startsWith(page));

	if (isPublicPage) {
		return;
	}

	// Check if user is authenticated
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated.value) {
		// Redirect to sign-in page with return URL
		return navigateTo(
			`/auth/signin?redirect=${encodeURIComponent(to.fullPath)}`,
		);
	}
});
