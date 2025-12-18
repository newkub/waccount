import { z } from 'zod';
import { sendMagicLink } from "../../../utils/auth";
import { readValidatedBody } from "../../../utils/api";

const MagicLinkSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
    try {
        const { email } = await readValidatedBody(event, MagicLinkSchema);
        return await sendMagicLink(email);
    } catch (error: any) {
        if (error.statusCode === 400) {
            throw error; // Re-throw Zod validation error
        }
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to send magic link",
        });
    }
});
