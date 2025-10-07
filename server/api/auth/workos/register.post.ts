// POST /api/auth/workos/register
// Register new user
import { Effect } from "effect";
import { signUpWithPassword } from "../../../services/auth";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password, firstName, lastName } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			message: "Email and password are required",
		});
	}

	try {
		const result = await Effect.runPromise(
			signUpWithPassword(email, password, { firstName, lastName }),
		);
		return result;
	} catch (error: any) {
		throw createError({
			statusCode: 400,
			message: error.message || "Registration failed",
		});
	}
});
