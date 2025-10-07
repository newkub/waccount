import { Effect, pipe } from "effect";
import type { User } from "~/types";

/**
 * Admin middleware using Effect TS
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

	/**
	 * Admin check using Effect
	 * Validates:
	 * 1. User is authenticated
	 * 2. User has admin role or isAdmin flag
	 */
	const checkAdminAccess = pipe(
		Effect.sync(() => {
			// Check authentication
			if (!isAuthenticated.value || !user.value) {
				throw new Error("Not authenticated");
			}
			return user.value;
		}),
		Effect.flatMap((currentUser) =>
			Effect.sync(() => {
				// Check admin role from user object
				// Supports both role-based ('admin') and flag-based (isAdmin: true)
				const hasAdminRole = currentUser.role === "admin";
				const hasAdminFlag = currentUser.isAdmin === true;

				if (!hasAdminRole && !hasAdminFlag) {
					throw new Error("Admin privileges required");
				}

				return currentUser;
			}),
		),
	);

	// Run the effect synchronously for middleware
	const result = Effect.runSyncExit(checkAdminAccess);

	if (result._tag === "Failure") {
		const error = result.cause;
		const errorMessage = String(error);

		// Handle authentication error
		if (errorMessage.includes("Not authenticated")) {
			return navigateTo("/auth/login");
		}

		// Handle authorization error
		throw createError({
			statusCode: 403,
			statusMessage: "Access denied. Admin privileges required.",
		});
	}
});
