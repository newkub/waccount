// GET /api/users/:userId
// Get user by ID
import { Effect } from "effect";
import { getUserById } from "../../services/auth";

export default defineEventHandler(async (event) => {
	const userId = getRouterParam(event, "userId");

	if (!userId) {
		throw createError({
			statusCode: 400,
			message: "User ID is required",
		});
	}

	try {
		const user = await Effect.runPromise(getUserById(userId));
		return { user };
	} catch (error: any) {
		throw createError({
			statusCode: 404,
			message: error.message || "User not found",
		});
	}
});
