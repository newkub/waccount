/**
 * Admin middleware
 * - Type-safe admin role checking
 * - Validates user authentication and admin privileges
 */
import { useAuth } from "~/composables/facade/useAuth";

export default defineNuxtRouteMiddleware((to) => {
	// Skip for non-admin pages
	const adminPages = ["/admin"];
	const isAdminPage = adminPages.some((page) => to.path.startsWith(page));

	if (!isAdminPage) {
		return;
	}

	// Check if user is authenticated and has admin role
	const { user, isAuthenticated } = useAuth();
	const runtimeConfig = useRuntimeConfig();

	// Check authentication
	if (!isAuthenticated.value || !user.value) {
		return navigateTo("/auth/login");
	}

	const adminEmailsRaw = runtimeConfig.public.adminEmails;
	const adminEmails = (typeof adminEmailsRaw === "string" ? adminEmailsRaw : "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	const isAdmin = adminEmails.includes(user.value.email);

	if (!isAdmin) {
		throw createError({
			statusCode: 403,
			statusMessage: "Access denied. Admin privileges required.",
		});
	}
});
