import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);

	await workos.userManagement.sendVerificationEmail({ userId: user.id });

	return { success: true };
});
