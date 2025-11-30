// GET /api/auth/workos/profile
// Get current user profile
import { getWorkOS } from "../../../lib/workos";

export default defineEventHandler(async (event) => {
	// Get session token from cookie
	const sessionToken = getCookie(event, "workos_session");

	if (!sessionToken) {
		throw createError({
			statusCode: 401,
			message: "Not authenticated",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Get user from session token
		const { user } = await workos.userManagement.authenticateWithRefreshToken({
			refreshToken: sessionToken,
			clientId: process.env.WORKOS_CLIENT_ID!,
		});

		return { profile: user };
	} catch (error: any) {
		console.error("Profile fetch error:", error);
		throw createError({
			statusCode: 401,
			message: error.message || "Failed to fetch profile",
		});
	}
});
