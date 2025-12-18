import { WorkOS } from "@workos-inc/node";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const workos = new WorkOS(config.workosApiKey);

	const authorizationURL = workos.userManagement.getAuthorizationUrl({
		provider: "authkit",
		redirectUri: config.workosRedirectUri,
		clientId: config.workosClientId,
	});

	await sendRedirect(event, authorizationURL);
});
