import { defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);
	const { factorId, code } = await readBody<{ factorId: string; code: string }>(event);

	const challenge = await workos.mfa.challengeFactor({
		authenticationFactorId: factorId,
	});

	const { valid } = await workos.mfa.verifyChallenge({
		authenticationChallengeId: challenge.id,
		code,
	});

	if (valid) {
		const metadata = {
			...(user as any).metadata,
			preferences: {
				...((user as any).metadata?.preferences as object),
				twoFactorEnabled: true,
			},
			mfaFactorId: factorId,
		};

		await workos.userManagement.updateUser({
			userId: user.id,
			metadata,
		});
	}

	return { valid };
});
