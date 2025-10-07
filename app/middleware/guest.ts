export default defineNuxtRouteMiddleware((to) => {
	// Only apply to auth pages (login, register)
	const authPages = ["/auth/login", "/auth/register"];
	const isAuthPage = authPages.includes(to.path);

	if (!isAuthPage) {
		return;
	}

	// Check if user is already authenticated
	const { isAuthenticated } = useAuth();

	if (isAuthenticated.value) {
		// Redirect to profile or intended page
		const redirectTo = (to.query.redirect as string) || "/profile";
		return navigateTo(redirectTo);
	}
});
