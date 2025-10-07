// POST /api/auth/workos/magic-link
// Send magic link for passwordless auth
import { Effect } from "effect";
import { sendMagicLink } from "~/server/services/auth";

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
		const result = await Effect.runPromise(sendMagicLink(email));
		return result;
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to send magic link",
		});
	}
});
