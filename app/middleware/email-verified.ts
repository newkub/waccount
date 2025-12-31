import { useAuth } from "~/composables/facade/useAuth";

export default defineNuxtRouteMiddleware((to) => {
	// Skip for non-protected pages
	const protectedPages = ["/@"]; // user pages live under /@:user
	const isProtectedPage = protectedPages.some((page) => to.path.startsWith(page));

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
		return;
	}
});
