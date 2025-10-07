export default defineNuxtRouteMiddleware((to) => {
	// Skip for non-protected pages
	const protectedPages = ["/profile", "/settings"];
	const isProtectedPage = protectedPages.some((page) =>
		to.path.startsWith(page),
	);

	if (!isProtectedPage) {
		return;
	}

	// Check if user is authenticated and email is verified
	const { user, isAuthenticated } = useAuth();

	if (!isAuthenticated.value || !user.value) {
		return navigateTo("/auth/login");
	}

	// Check if email is verified
	if (!user.value.emailVerified) {
		// Redirect to email verification prompt
		return navigateTo("/auth/verify-email");
	}
});
