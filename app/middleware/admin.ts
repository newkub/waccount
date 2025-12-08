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

	// Check if user is authenticated and has admin role
		const { user, isAuthenticated } = useAuth();

	// Check authentication
	if (!isAuthenticated.value || !user.value) {
		return navigateTo("/auth/signin");
	}

	// Check admin privileges
	// Supports both role-based ('admin') and flag-based (isAdmin: true)
	const hasAdminRole = user.value.role === "admin";
	const hasAdminFlag = user.value.isAdmin === true;

	if (!hasAdminRole && !hasAdminFlag) {
		throw createError({
			statusCode: 403,
			statusMessage: "Access denied. Admin privileges required.",
		});
	}

	// User has admin access - continue to admin page
});
