import { WorkOS } from "@workos-inc/node";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const workos = new WorkOS(config.workosApiKey);
	const { code } = getQuery(event);

	if (typeof code !== "string") {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing authorization code",
		});
	}

	try {
		const { user } = await workos.userManagement.authenticateWithCode({
			code,
			clientId: config.workosClientId,
		});

		const session = await useSession(event, {
			password: config.nuxtSecret,
		});

		await session.update({ user });

		return sendRedirect(event, "/");
	} catch (error) {
		console.error("WorkOS authentication failed:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Authentication failed",
		});
	}
});
