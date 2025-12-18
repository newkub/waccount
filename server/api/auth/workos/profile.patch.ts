// PATCH /api/auth/workos/profile
// Update user profile
import { updateUserProfile } from "../../../utils/user";

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
		const profile = await updateUserProfile(userId, body);
		return { profile };
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to update profile";
		throw createError({
			statusCode: 500,
			message,
		});
	}
});
