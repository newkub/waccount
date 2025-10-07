// PATCH /api/auth/workos/profile
// Update user profile
import { Effect } from "effect";
import { updateUserProfile } from "../../../services/user";

export default defineEventHandler(async (event) => {
	// TODO: Get userId from session/cookie
	const userId = getCookie(event, "user_id");

	if (!userId) {
		throw createError({
			statusCode: 401,
			message: "Not authenticated",
		});
	}

	const body = await readBody(event);

	try {
		const profile = await Effect.runPromise(updateUserProfile(userId, body));
		return { profile };
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to update profile",
		});
	}
});
