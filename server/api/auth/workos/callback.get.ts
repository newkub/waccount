// GET /api/auth/workos/callback
// Handle OAuth callback
import { getWorkOS } from "../../../lib/workos";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { code } = query;

	if (!code) {
		throw createError({
			statusCode: 400,
			message: "Authorization code is required",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Exchange authorization code for access token
		const { accessToken } = await workos.userManagement.authenticateWithCode({
			code: code as string,
			clientId: process.env.WORKOS_CLIENT_ID!,
		});

		// Set session cookie
		setCookie(event, "workos_session", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		// Redirect to account page
		return sendRedirect(event, "/account");
	} catch (error: any) {
		console.error("OAuth callback error:", error);
		throw createError({
			statusCode: 401,
			message: error.message || "Authentication failed",
		});
	}
});
