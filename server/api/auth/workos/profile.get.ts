import { getUserProfile } from "../../../utils/user";

export default defineEventHandler(async (event) => {
    try {
        // TODO: Replace with a more secure session management
        const userId = getCookie(event, "user_id");
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const profile = await getUserProfile(userId);
        return { profile };

    } catch (error: any) {
        const statusCode = error.message === "Not authenticated" ? 401 : 500;
        throw createError({
            statusCode,
            statusMessage: error.message || "Failed to fetch profile",
        });
    }
});
