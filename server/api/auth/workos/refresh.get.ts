import { refreshSession, setAuthCookies } from "../../../utils/auth";
import { defineApiHandler } from "../../../utils/api";

export default defineApiHandler(async (event) => {
    const refreshToken = getCookie(event, "workos-refresh");

    if (!refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: "No refresh token found",
        });
    }

        const { user, accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

    setAuthCookies(event, user.id, accessToken, newRefreshToken);

    return { user };
});
