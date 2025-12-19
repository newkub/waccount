import { updateUserProfile } from "../../../utils/user";
import { readValidatedBody, defineApiHandler } from "../../../utils/api";
import { UpdateProfileDataSchema } from "../../../../shared/types";

export default defineApiHandler(async (event) => {
    if (!event.context.user?.id) {
        throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
    }
    const userId = event.context.user.id;

    const body = await readValidatedBody(event, UpdateProfileDataSchema);
    const profile = await updateUserProfile(userId, body);
    return { profile };
});
