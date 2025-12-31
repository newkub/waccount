import { createError, defineEventHandler } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { getWorkosAuthkitConfig } from "../../../../utils/authkit-session";

const providerMap = {
	google: "GoogleOAuth",
	github: "GitHubOAuth",
} as const;

type ProviderSlug = keyof typeof providerMap;

export default defineEventHandler(async (event) => {
	const provider = event.context.params?.provider as string | undefined;

	if (!provider) {
		throw createError({ statusCode: 400, statusMessage: "Missing provider" });
	}

	const runtimeConfig = useRuntimeConfig();
	if (!runtimeConfig.workosRedirectUri) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_REDIRECT_URI",
		});
	}

	const { workos, clientId } = getWorkosAuthkitConfig();

	const mappedProvider = providerMap[provider as ProviderSlug];
	if (!mappedProvider) {
		throw createError({
			statusCode: 400,
			statusMessage: "Unsupported provider",
		});
	}

	const authorizationUrl = workos.userManagement.getAuthorizationUrl({
		clientId,
		redirectUri: runtimeConfig.workosRedirectUri,
		provider: mappedProvider,
	});

	return { authorizationUrl };
});
