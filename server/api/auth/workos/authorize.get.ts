import { createError, defineEventHandler } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";

import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig(event);
	if (!runtimeConfig.workosRedirectUri) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_REDIRECT_URI",
		});
	}

	const workos = createWorkos(event);

	const authorizationUrl = workos.userManagement.getAuthorizationUrl({
		clientId: runtimeConfig.public.workosClientId,
		redirectUri: runtimeConfig.workosRedirectUri,
	});

	return { authorizationUrl };
});
