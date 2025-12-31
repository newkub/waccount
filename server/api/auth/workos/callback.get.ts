import { createError, defineEventHandler, getQuery, sendRedirect } from "h3";
import { getUserHandle } from "../../../../shared/utils/user-handle";
import { getWorkosAuthkitConfig, setSealedSessionCookie } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const { code } = getQuery(event);
	if (typeof code !== "string" || !code) {
		throw createError({ statusCode: 400, statusMessage: "No code provided" });
	}

	const { workos, clientId, cookiePassword } = getWorkosAuthkitConfig();

	const authenticateResponse = await workos.userManagement.authenticateWithCode(
		{
			clientId,
			code,
			session: {
				sealSession: true,
				cookiePassword,
			},
		},
	);

	if (!authenticateResponse.sealedSession) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing sealed session",
		});
	}

	setSealedSessionCookie(event, authenticateResponse.sealedSession);

	const userHandle = getUserHandle({
		firstName: authenticateResponse.user.firstName ?? null,
		lastName: authenticateResponse.user.lastName ?? null,
		email: authenticateResponse.user.email,
	});

	return sendRedirect(event, `/${userHandle}`, 302);
});
