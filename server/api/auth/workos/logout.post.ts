// POST /api/auth/workos/logout
// Sign out user
export default defineEventHandler(async (event) => {
	// Clear cookies/session
	deleteCookie(event, "user_id");
	deleteCookie(event, "access_token");
	deleteCookie(event, "refresh_token");

	return {
		success: true,
		message: "Logged out successfully",
	};
});
