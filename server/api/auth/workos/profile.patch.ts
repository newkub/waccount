import { updateUserProfile } from "../../../utils/user";
import { readValidatedBody } from "../../../utils/api";
import { UpdateProfileDataSchema } from "~/shared/types";

export default defineEventHandler(async (event) => {
    try {
        const userId = getCookie(event, "user_id");
        if (!userId) {
            throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
        }

        const body = await readValidatedBody(event, UpdateProfileDataSchema);
        const profile = await updateUserProfile(userId, body);
        return { profile };

    } catch (error: any) {
        if (error.statusCode === 400) {
            throw error; // Re-throw Zod validation error
        }
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to update profile",
        });
    }
});
