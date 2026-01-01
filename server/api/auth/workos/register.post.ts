import { createError, defineEventHandler, readValidatedBody } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { z } from "zod";
import { sealSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

const RegisterBody = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
});

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, (body) => RegisterBody.safeParse(body));

	if (!body.success) {
		throw createError({ statusCode: 400, statusMessage: "Validation failed", data: body.error.issues });
	}

	const { email, password, firstName, lastName } = body.data;

	const workos = createWorkos(event);

	try {
		// Create the user in WorkOS
		await workos.userManagement.createUser({
			email,
			password,
			firstName,
			lastName,
			emailVerified: false, // User will verify their email
		});

		// Authenticate the new user to create a session
		const { user, sealedSession } = await workos.userManagement.authenticateWithPassword({
			clientId: useRuntimeConfig(event).public.workosClientId,
			email,
			password,
		});

		// Seal the session and set the cookie
		if (sealedSession) {
			await sealSession(event, sealedSession);
		}

		return {
			user,
		};
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to register user",
			data: error.message,
		});
	}
});
