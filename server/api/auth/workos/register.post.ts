// POST /api/auth/workos/register
// Register new user
import { getWorkOS } from "../../../lib/workos";

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
		const workos = getWorkOS();
		
		// Create user with WorkOS
		const user = await workos.userManagement.createUser({
			email,
			password,
			firstName: firstName || '',
			lastName: lastName || '',
		});

		return { user };
	} catch (error: any) {
		console.error("Registration error:", error);
		throw createError({
			statusCode: 400,
			message: error.message || "Registration failed",
		});
	}
});
