import { signUpWithPassword } from "../../../utils/auth";
import { readValidatedBody, defineApiHandler } from "../../../utils/api";
import { RegisterFormDataSchema } from "../../../../shared/types";

export default defineApiHandler(async (event) => {
    const { email, password, firstName, lastName } = await readValidatedBody(event, RegisterFormDataSchema);
    const { user, message } = await signUpWithPassword(email, password, { firstName, lastName });
    return { user, message };
});
