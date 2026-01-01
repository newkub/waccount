import { createError, defineEventHandler, readBody } from "h3";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const body = await readBody<{ token?: string; newPassword?: string }>(event);
	if (!body?.token || !body.newPassword) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing token or newPassword",
		});
	}

	const { workos } = getWorkosAuthkitConfig();
	await workos.userManagement.resetPassword({
		token: body.token,
		newPassword: body.newPassword,
	});

	return { success: true };
});
