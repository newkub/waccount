export default defineNuxtRouteMiddleware((to) => {
	const { isAuthenticated } = useAuth();

	if (publicPages.includes(to.path)) {
		return;
	}

	if (!isAuthenticated.value) {
		return navigateTo(
			`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`,
		);
	}
});
