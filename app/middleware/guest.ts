export default defineNuxtRouteMiddleware((to) => {
	const { isAuthenticated } = useAuth();

	// If user is authenticated and tries to access an auth page, redirect them.
	if (isAuthenticated.value && authPages.includes(to.path)) {
		const redirectTo = (to.query.redirect as string) || "/profile";
		return navigateTo(redirectTo);
	}
});
