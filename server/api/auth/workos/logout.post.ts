// POST /api/auth/workos/logout
// Sign out user
export default defineEventHandler(async (event) => {
	// Clear WorkOS session cookie
	deleteCookie(event, "workos_session");

	return {
		success: true,
		message: "Logged out successfully",
	};
});
