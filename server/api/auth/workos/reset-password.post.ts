// POST /api/auth/workos/reset-password
// Send password reset email
import { getWorkOS, getWorkOSRedirectUri } from "../../../lib/workos";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email } = body;

	if (!email) {
		throw createError({
			statusCode: 400,
			message: "Email is required",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Create passwordless session for reset
		const session = await workos.passwordless.createSession({
			email,
			type: 'MagicLink',
			redirectURI: `${getWorkOSRedirectUri()}/auth/reset-password/callback`,
		});

		// Send password reset email
		await workos.passwordless.sendSession(session.id);

		return {
			success: true,
			message: "Password reset email sent successfully",
		};
	} catch (error: any) {
		console.error("Password reset error:", error);
		throw createError({
			statusCode: 400,
			message: error.message || "Failed to send password reset email",
		});
	}
});
