import { defineEventHandler } from "h3";
import { clearSealedSessionCookie, loadSessionFromCookie } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const session = await loadSessionFromCookie(event);

	clearSealedSessionCookie(event);

	if (!session) {
		return { success: true };
	}

	const logoutUrl = await session.getLogoutUrl();
	return { success: true, logoutUrl };
});
