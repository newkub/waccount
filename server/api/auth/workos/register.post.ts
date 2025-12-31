import { createError, defineEventHandler, readBody } from "h3";
import { setSealedSessionCookie } from "../../../utils/authkit-session";
import { mapWorkosUserToAppUser, registerAndAuthenticateUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const body = await readBody<{
		email?: string;
		password?: string;
		firstName?: string;
		lastName?: string;
	}>(event);

	if (!body?.email || !body.password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing email or password",
		});
	}

	const authResponse = await registerAndAuthenticateUser({
		email: body.email,
		password: body.password,
		firstName: body.firstName,
		lastName: body.lastName,
	});

	if (!authResponse.sealedSession) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing sealed session",
		});
	}

	setSealedSessionCookie(event, authResponse.sealedSession);

	return { user: mapWorkosUserToAppUser(authResponse.user) };
});
