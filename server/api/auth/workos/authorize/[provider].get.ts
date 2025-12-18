import { getAuthorizationUrl } from "../../../../utils/auth";

export default defineEventHandler((event) => {
    const provider = getRouterParam(event, "provider");

    if (!provider) {
        throw createError({
            statusCode: 400,
            statusMessage: "Provider is required",
        });
    }

    try {
        const { authorizationUrl } = getAuthorizationUrl(provider);
        return { authorizationUrl };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to get authorization URL",
        });
    }
});
