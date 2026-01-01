export default defineEventHandler(async (event) => {
	const workos = createWorkos(event);
	const config = useRuntimeConfig(event);

	const authorizationUrl = workos.userManagement.getAuthorizationUrl({
		provider: "authkit",
		redirectUri: config.workosRedirectUri,
		clientId: config.public.workosClientId,
	});

	await sendRedirect(event, authorizationUrl);
});
