import { createError, defineEventHandler } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";

import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async () => {
	const runtimeConfig = useRuntimeConfig();
	if (!runtimeConfig.workosRedirectUri) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_REDIRECT_URI",
		});
	}

	const { workos, clientId } = getWorkosAuthkitConfig();

	const authorizationUrl = workos.userManagement.getAuthorizationUrl({
		clientId,
		redirectUri: runtimeConfig.workosRedirectUri,
	});

	return { authorizationUrl };
});
