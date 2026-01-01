import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { clearSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);

	await workos.userManagement.deleteUser(user.id);
	await clearSession(event);

	return { success: true };
});
