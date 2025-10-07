// GET /api/auth/workos/profile
// Get current user profile
import { Effect } from "effect";
import { getUserProfile } from "../../../services/user";

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
		const profile = await Effect.runPromise(getUserProfile(userId));
		return { profile };
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to fetch profile",
		});
	}
});
