import { refreshSession, setAuthCookies } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, "workos-refresh");

    if (!refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: "No refresh token found",
        });
    }

    try {
        const { user, accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

        setAuthCookies(event, accessToken, newRefreshToken);

        return { user };
    } catch (error: any) {
        // If refresh fails, clear cookies to force re-login
        deleteCookie(event, "workos-session");
        deleteCookie(event, "workos-refresh");
        
        throw createError({
            statusCode: 401,
            statusMessage: error.message || "Session refresh failed",
        });
    }
});
