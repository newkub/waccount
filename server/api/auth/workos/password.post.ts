import { createError, defineEventHandler, getHeader, readBody } from "h3";
import { getWorkosAuthkitConfig, setSealedSessionCookie } from "../../../utils/authkit-session";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const body = await readBody<{ email?: string; password?: string }>(event);
	if (!body?.email || !body.password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing email or password",
		});
	}

	const { workos, clientId, cookiePassword } = getWorkosAuthkitConfig();

	const userAgent = getHeader(event, "user-agent") ?? undefined;

	const authResponse = await workos.userManagement.authenticateWithPassword({
		clientId,
		email: body.email,
		password: body.password,
		userAgent,
		session: {
			sealSession: true,
			cookiePassword,
		},
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
