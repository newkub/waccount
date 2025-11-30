// POST /api/auth/workos/magic-link
// Send magic link for passwordless auth
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
		
		// Create passwordless session
		const session = await workos.passwordless.createSession({
			email,
			type: 'MagicLink',
			redirectURI: `${getWorkOSRedirectUri()}/auth/callback`,
		});

		// Send magic link email
		await workos.passwordless.sendSession(session.id);

		return {
			success: true,
			message: "Magic link sent successfully",
		};
	} catch (error: any) {
		console.error("Magic link error:", error);
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to send magic link",
		});
	}
});
