// GET /api/auth/workos/authorize/:provider
// Get OAuth authorization URL
import { getWorkOS, getWorkOSClientId, getWorkOSRedirectUri } from "../../../../../lib/workos";

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, "provider");

	if (!provider) {
		throw createError({
			statusCode: 400,
			message: "Provider is required",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Generate authorization URL
		const authorizationUrl = workos.userManagement.getAuthorizationUrl({
			provider,
			clientId: getWorkOSClientId(),
			redirectUri: `${getWorkOSRedirectUri()}/auth/callback`,
		});

		return { authorizationUrl };
	} catch (error: any) {
		console.error("OAuth authorization error:", error);
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to get authorization URL",
		});
	}
});
