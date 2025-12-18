// GET /api/auth/workos/callback
// Handle OAuth callback from WorkOS
import { getWorkOS, getWorkOSClientId } from "../../../integrations/workos";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const code = query.code as string;

	if (!code) {
		throw createError({
			statusCode: 400,
			message: "Authorization code is required",
		});
	}

	try {
		const workos = getWorkOS();
		const clientId = getWorkOSClientId();

		// Exchange code for access token
		const result = await workos.userManagement.authenticateWithCode({
			clientId,
			code,
		});

		// Set session cookie
		setCookie(event, "workos-session", result.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		// Set refresh token if available
		if (result.refreshToken) {
			setCookie(event, "workos-refresh", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30, // 30 days
			});
		}

		return {
			user: {
				id: result.user.id,
				email: result.user.email,
				name: result.user.firstName
					? `${result.user.firstName} ${result.user.lastName || ""}`.trim()
					: result.user.email,
				avatar: result.user.profilePictureUrl || undefined,
				emailVerified: result.user.emailVerified,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		};
	} catch (error: unknown) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to authenticate with OAuth provider";
		throw createError({
			statusCode: 500,
			message,
		});
	}
});
