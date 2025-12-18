import { clearAuthCookies } from "../../../utils/auth";

export default defineEventHandler((event) => {
    try {
        clearAuthCookies(event);
        return { success: true, message: "Logged out successfully" };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to log out",
        });
    }
});
