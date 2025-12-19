import { getAuthorizationUrl } from "../../../../utils/auth";
import { defineApiHandler } from "../../../../utils/api";

export default defineApiHandler((event) => {
    const provider = getRouterParam(event, "provider");

    if (!provider) {
        throw createError({
            statusCode: 400,
            statusMessage: "Provider is required",
        });
    }

        const { authorizationUrl } = getAuthorizationUrl(provider);
    return { authorizationUrl };
});
