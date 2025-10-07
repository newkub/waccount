// POST /api/auth/workos/password
// Sign in with email and password
import { Effect } from "effect";
import { signInWithPassword } from "../../../services/auth";

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
		const result = await Effect.runPromise(signInWithPassword(email, password));
		return result;
	} catch (error: any) {
		throw createError({
			statusCode: 401,
			message: error.message || "Authentication failed",
		});
	}
});
