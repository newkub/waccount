import { createError, defineEventHandler, readBody } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const body = await readBody<{ email?: string }>(event);
	if (!body?.email) {
		throw createError({ statusCode: 400, statusMessage: "Missing email" });
	}

	const runtimeConfig = useRuntimeConfig();
	const baseUrl = runtimeConfig.public?.baseUrl;
	if (typeof baseUrl !== "string" || !baseUrl) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_PUBLIC_BASE_URL",
		});
	}

	const { workos } = getWorkosAuthkitConfig();

	await workos.userManagement.sendPasswordResetEmail({
		email: body.email,
		passwordResetUrl: `${baseUrl.replace(/\/$/, "")}/auth/reset-password`,
	});

	return { success: true };
});
