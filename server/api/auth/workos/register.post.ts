import { signUpWithPassword } from "../../../utils/auth";
import { readValidatedBody } from "../../../utils/api";
import { RegisterFormDataSchema } from "~/shared/types";

export default defineEventHandler(async (event) => {
    try {
        const { email, password, firstName, lastName } = await readValidatedBody(event, RegisterFormDataSchema);

        const { user, message } = await signUpWithPassword(email, password, { firstName, lastName });
        return { user, message };
    } catch (error: any) {
        if (error.statusCode === 400) {
            throw error; // Re-throw Zod validation error
        }
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Registration failed",
        });
    }
});
