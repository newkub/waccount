import { clearAuthCookies } from "../../../utils/auth";
import { defineApiHandler } from "../../../utils/api";

export default defineApiHandler((event) => {
    clearAuthCookies(event);
    return { success: true, message: "Logged out successfully" };
});
