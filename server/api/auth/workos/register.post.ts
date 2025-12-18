import { signUpWithPassword } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
    const { email, password, firstName, lastName } = await readBody(event);

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Email and password are required",
        });
    }

    try {
        const { user, message } = await signUpWithPassword(email, password, { firstName, lastName });
        return { user, message };
    } catch (error: any) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message || "Registration failed",
        });
    }
});
