import { signInWithPassword } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Email and password are required",
        });
    }

    try {
        const { user, accessToken, refreshToken } = await signInWithPassword(email, password);

        // Set cookies or session here if needed

        return { user };
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: error.message || "Authentication failed",
        });
    }
});
