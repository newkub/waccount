/**
 * Admin middleware
 * - Validates user authentication and admin privileges
 * - Supports both role-based and flag-based admin access
 */
import { useAuth } from '~/composables/auth';

export default defineNuxtRouteMiddleware((to) => {
	// Skip for non-admin pages
	const adminPages = ["/admin", "/admin/"];
	const isAdminPage = adminPages.some((page) => to.path.startsWith(page));

	if (!isAdminPage) {
		return;
	}

	const { user, isAuthenticated } = useAuth();

	// 1. Check authentication
	if (!isAuthenticated.value || !user.value) {
		return navigateTo("/auth/login");
	}

	// 2. Check admin privileges
	const runtimeConfig = useRuntimeConfig();
	const adminEmailsRaw = runtimeConfig.public.adminEmails;
	const adminEmails = (typeof adminEmailsRaw === "string" ? adminEmailsRaw : "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	
	const isEmailAdmin = adminEmails.includes(user.value.email);
	const hasAdminRole = user.value.role === "admin";
	const hasAdminFlag = user.value.isAdmin === true;

	if (!isEmailAdmin && !hasAdminRole && !hasAdminFlag) {
		throw createError({
			statusCode: 403,
			statusMessage: "Access denied. Admin privileges required.",
		});
	}

	// User has admin access - continue to admin page
});
