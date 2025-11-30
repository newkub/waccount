// POST /api/auth/workos/password
// Sign in with email and password
import { getWorkOS } from "../../lib/workos";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			message: "Email and password are required",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Create session with password
		const { user, accessToken } = await workos.passwordless.createSession({
			email,
			password,
		});

		// Set session cookie
		setCookie(event, "workos_session", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return { user };
	} catch (error: any) {
		console.error("Password authentication error:", error);
		throw createError({
			statusCode: 401,
			message: error.message || "Authentication failed",
		});
	}
});
