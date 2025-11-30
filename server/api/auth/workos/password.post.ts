// POST /api/auth/workos/password
// Sign in with email and password

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
		// For password auth, we need to use a different approach
		// WorkOS passwordless doesn't support password authentication directly
		// This would typically use a different auth method like SSO or OAuth
		// For now, return an error indicating password auth is not supported
		throw createError({
			statusCode: 501,
			message: "Password authentication not implemented. Use magic link authentication instead.",
		});
	} catch (error: any) {
		console.error("Password authentication error:", error);
		throw createError({
			statusCode: 401,
			message: error.message || "Authentication failed",
		});
	}
});
