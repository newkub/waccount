import { useAuth } from "~/composables/facade/useAuth";

export default defineNuxtRouteMiddleware((to) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated.value) {
		return navigateTo(`/auth/login?redirect=${to.fullPath}`);
	}
});
