// GET /api/auth/workos/authorize/:provider
// Get OAuth authorization URL
import { Effect } from "effect";
import { getAuthorizationUrl } from "~/server/services/auth";

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, "provider");

	if (!provider) {
		throw createError({
			statusCode: 400,
			message: "Provider is required",
		});
	}

	try {
		const result = await Effect.runPromise(getAuthorizationUrl(provider));
		return result;
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: error.message || "Failed to get authorization URL",
		});
	}
});
