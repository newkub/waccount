import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const { workos } = getWorkosAuthkitConfig();

	const factor = await workos.mfa.enrollFactor({
		type: "totp",
		issuer: "Wrikka", // Or your app's name
		user: user.email,
	});

	return {
		id: factor.id,
		qrCode: factor.totp.qrCode,
		secret: factor.totp.secret,
	};
});
