// PATCH /api/auth/workos/profile
// Update user profile
import { getWorkOS, getWorkOSClientId } from "../../../lib/workos";

export default defineEventHandler(async (event) => {
	// Get session token from cookie
	const sessionToken = getCookie(event, "workos_session");

	if (!sessionToken) {
		throw createError({
			statusCode: 401,
			message: "Not authenticated",
		});
	}

	const body = await readBody(event);

	try {
		const workos = getWorkOS();
		
		// First get user from session
		const { user } = await workos.userManagement.authenticateWithRefreshToken({
			refreshToken: sessionToken,
			clientId: getWorkOSClientId(),
		});

		// Update user profile
		const updatedUser = await workos.userManagement.updateUser({
			userId: user.id,
			...body,
		});

		return { profile: updatedUser };
	} catch (error: any) {
		console.error("Profile update error:", error);
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to update profile",
		});
	}
});
