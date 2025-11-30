// GET /api/auth/workos/refresh
// Refresh user session
import { getWorkOS, getWorkOSClientId } from "../../lib/workos";

export default defineEventHandler(async (event) => {
	const sessionToken = getCookie(event, "workos_session");

	if (!sessionToken) {
		return { user: null };
	}

	try {
		const workos = getWorkOS();
		
		// Verify session and get user
		const { user } = await workos.userManagement.authenticateWithRefreshToken({
			refreshToken: sessionToken,
			clientId: getWorkOSClientId(),
		});

		return { user };
	} catch (error: any) {
		console.error("Session refresh error:", error);
		// Clear invalid session
		deleteCookie(event, "workos_session");
		return { user: null };
	}
});
