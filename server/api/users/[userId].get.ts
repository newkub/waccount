// GET /api/users/:userId
// Get user by ID
import { getWorkOS } from "../../lib/workos";

export default defineEventHandler(async (event) => {
	const userId = getRouterParam(event, "userId");

	if (!userId) {
		throw createError({
			statusCode: 400,
			message: "User ID is required",
		});
	}

	try {
		const workos = getWorkOS();
		
		// Get user from WorkOS
		const user = await workos.userManagement.getUser(userId);
		
		return { user };
	} catch (error: any) {
		throw createError({
			statusCode: 404,
			message: error.message || "User not found",
		});
	}
});
