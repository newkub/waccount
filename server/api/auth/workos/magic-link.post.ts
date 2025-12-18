// POST /api/auth/workos/magic-link
// Send magic link for passwordless auth
import { sendMagicLink } from "../../../utils/auth";

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
		const result = await sendMagicLink(email);
		return result;
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to send magic link";
		throw createError({
			statusCode: 500,
			message,
		});
	}
});
