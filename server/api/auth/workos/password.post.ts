import { signInWithPassword, setAuthCookies } from "../../../utils/auth";
import { readValidatedBody } from "../../../utils/api";
import { LoginFormDataSchema } from "~/shared/types";

export default defineEventHandler(async (event) => {
    try {
        const { email, password } = await readValidatedBody(event, LoginFormDataSchema);

        const { user, accessToken, refreshToken } = await signInWithPassword(email, password);

        setAuthCookies(event, accessToken, refreshToken);

        return { user };
    } catch (error: any) {
        // If the error is a Zod validation error, it will have a statusCode of 400
        if (error.statusCode === 400) {
            throw error;
        }

        throw createError({
            statusCode: 401,
            statusMessage: error.message || "Authentication failed",
        });
    }
});
