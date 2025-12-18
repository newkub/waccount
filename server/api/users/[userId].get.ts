// GET /api/users/:userId
// Get user by ID
import { getUserById } from "../../utils/auth";

export default defineEventHandler(async (event) => {
	const userId = getRouterParam(event, "userId");

	if (!userId) {
		throw createError({
			statusCode: 400,
			message: "User ID is required",
		});
	}

	try {
		const user = await getUserById(userId);
		return { user };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "User not found";
		throw createError({
			statusCode: 404,
			message,
		});
	}
});
