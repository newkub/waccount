import { getUserHandle } from "#shared/utils/user-handle";
import { createError, defineEventHandler, getQuery, sendRedirect } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { sealSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { code } = getQuery(event);
	if (typeof code !== "string" || !code) {
		throw createError({ statusCode: 400, statusMessage: "No code provided" });
	}

	const workos = createWorkos(event);
	const { public: { workosClientId }, workosCookiePassword } = useRuntimeConfig(event);

	const authenticateResponse = await workos.userManagement.authenticateWithCode(
		{
			clientId: workosClientId,
			code,
			session: {
				sealSession: true,
				cookiePassword: workosCookiePassword,
			},
		},
	);

	if (!authenticateResponse.sealedSession) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing sealed session",
		});
	}

	await sealSession(event, authenticateResponse.sealedSession);

	const userHandle = getUserHandle({
		firstName: authenticateResponse.user.firstName ?? null,
		lastName: authenticateResponse.user.lastName ?? null,
		email: authenticateResponse.user.email,
	});

	return sendRedirect(event, `/${userHandle}`, 302);
});
