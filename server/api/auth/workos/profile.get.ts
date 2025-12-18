// GET /api/auth/workos/profile
// Get current user profile
import { getUserProfile } from "../../../utils/user";

export default defineEventHandler(async (event) => {
	// TODO: Get userId from session/cookie
	const userId = getCookie(event, "user_id");

	if (!userId) {
		throw createError({
			statusCode: 401,
			message: "Not authenticated",
		});
	}

	try {
		const profile = await getUserProfile(userId);
		return { profile };
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch profile";
		throw createError({
			statusCode: 500,
			message,
		});
	}
});
