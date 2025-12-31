import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { clearSealedSessionCookie, getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const { workos } = getWorkosAuthkitConfig();

	await workos.userManagement.deleteUser(user.id);
	clearSealedSessionCookie(event);

	return { success: true };
});
