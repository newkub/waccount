export default defineNuxtRouteMiddleware((to) => {
	// Skip middleware for auth pages and public pages
	const publicPages = ["/", "/auth/login", "/auth/register"];
	const isPublicPage = publicPages.includes(to.path);

	if (isPublicPage) {
		return;
	}

	// Check if user is authenticated
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated.value) {
		// Redirect to login page with return URL
		return navigateTo(
			`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`,
		);
	}
});
