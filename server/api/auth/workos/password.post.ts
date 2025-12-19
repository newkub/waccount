import { signInWithPassword, setAuthCookies } from "../../../utils/auth";
import { readValidatedBody, defineApiHandler } from "../../../utils/api";
import { LoginFormDataSchema } from "../../../../shared/types";

export default defineApiHandler(async (event) => {
    const { email, password } = await readValidatedBody(event, LoginFormDataSchema);
    const { user, accessToken, refreshToken } = await signInWithPassword(email, password);
    setAuthCookies(event, user.id, accessToken, refreshToken);
    return { user };
});
