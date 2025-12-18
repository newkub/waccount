/**
 * Admin middleware
 * - Type-safe admin role checking
 * - Validates user authentication and admin privileges
 */
export default defineNuxtRouteMiddleware((to) => {
	// Skip for non-admin pages
	const adminPages = ["/admin"];
	const isAdminPage = adminPages.some((page) => to.path.startsWith(page));

	if (!isAdminPage) {
		return;
	}

	// Check if user is authenticated and has admin role
	const { user, isAuthenticated } = useAuth();

	// Check authentication
	if (!isAuthenticated.value || !user.value) {
		return navigateTo("/auth/login");
	}

	// Check admin role from user object
	// Supports both role-based ('admin') and flag-based (isAdmin: true)
	const hasAdminRole = user.value.role === "admin";
	const hasAdminFlag = user.value.isAdmin === true;

	if (!hasAdminRole && !hasAdminFlag) {
		throw createError({
			statusCode: 403,
			statusMessage: "Access denied. Admin privileges required.",
		});
	}
});
