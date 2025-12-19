import { z } from 'zod';
import { sendMagicLink } from "../../../utils/auth";
import { readValidatedBody, defineApiHandler } from "../../../utils/api";

const MagicLinkSchema = z.object({
  email: z.string().email(),
});

export default defineApiHandler(async (event) => {
    const { email } = await readValidatedBody(event, MagicLinkSchema);
    return await sendMagicLink(email);
});
