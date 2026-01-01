import { z } from "zod";
import { sealSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

const LoginBody = z.object({
	email: z.string().email(),
	password: z.string(),
});

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, (body) => LoginBody.safeParse(body));

	if (!body.success) {
		throw createError({ statusCode: 400, statusMessage: "Validation failed", data: body.error.issues });
	}

	const { email, password } = body.data;
	const workos = createWorkos(event);

	try {
		const { user, sealedSession } = await workos.userManagement.authenticateWithPassword({
			clientId: useRuntimeConfig(event).public.workosClientId,
			email,
			password,
		});

		if (sealedSession) {
			await sealSession(event, sealedSession);
		}

		return {
			user,
		};
	} catch (error: any) {
		throw createError({
			statusCode: 401, // Unauthorized
			statusMessage: "Authentication failed",
			data: error.message,
		});
	}
});
