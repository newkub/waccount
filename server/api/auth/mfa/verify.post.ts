import { defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const { workos } = getWorkosAuthkitConfig();
	const { factorId, code } = await readBody<{ factorId: string; code: string }>(event);

	const challenge = await workos.mfa.challengeFactor({
		authenticationFactorId: factorId,
	});

	const { valid } = await workos.mfa.verifyChallenge({
		authenticationChallengeId: challenge.id,
		code,
	});

	if (valid) {
		const unsafeMetadata = {
			...user.unsafeMetadata,
			preferences: {
				...(user.unsafeMetadata?.preferences as object),
				twoFactorEnabled: true,
			},
			mfaFactorId: factorId,
		};

		await workos.userManagement.updateUser({
			userId: user.id,
			unsafeMetadata,
		});
	}

	return { valid };
});
