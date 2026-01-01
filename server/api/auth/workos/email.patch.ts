import { createError, defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const body = await readBody<{ email?: string }>(event);

	if (!body?.email) {
		throw createError({ statusCode: 400, statusMessage: "Missing email" });
	}

	const workos = createWorkos(event);

	await workos.userManagement.updateUser({
		userId: user.id,
		email: body.email,
		emailVerified: false,
	});

	await workos.userManagement.sendVerificationEmail({ userId: user.id });

	return { success: true };
});
