import { sendMagicLink } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const { email } = await readBody(event);
        if (!email) {
            throw createError({ statusCode: 400, statusMessage: "Email is required" });
        }

        return await sendMagicLink(email);
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to send magic link",
        });
    }
});
