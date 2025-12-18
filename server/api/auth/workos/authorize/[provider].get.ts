// GET /api/auth/workos/authorize/:provider
// Get OAuth authorization URL
import { getAuthorizationUrl } from "../../../../utils/auth";

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, "provider");

	if (!provider) {
		throw createError({
			statusCode: 400,
			message: "Provider is required",
		});
	}

	try {
		const result = getAuthorizationUrl(provider);
		return result;
	} catch (error: unknown) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to get authorization URL";
		throw createError({
			statusCode: 500,
			message,
		});
	}
});
