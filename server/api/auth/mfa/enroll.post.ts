import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);

	const factor = await workos.mfa.enrollFactor({
		type: "totp",
		issuer: "Wrikka", // Or your app's name
		user: user.email,
	});

	if (!factor.totp) {
		throw createError({ statusCode: 500, statusMessage: "Failed to enroll MFA factor" });
	}

	return {
		id: factor.id,
		qrCode: factor.totp.qrCode,
		secret: factor.totp.secret,
	};
});
