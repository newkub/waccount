import { z } from "zod";

export const RecoveryCodeSchema = z.object({
	code: z.string(),
	used: z.boolean(),
	usedAt: z.string().datetime().nullable().optional(),
});

export const TrustedContactSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	relationship: z.string(),
	verified: z.boolean(),
	verifiedAt: z.string().datetime().nullable().optional(),
});

export const AccountRecoverySchema = z.object({
	recoveryEmail: z.string().email().nullable().optional(),
	recoveryCodes: z.array(RecoveryCodeSchema),
	trustedContacts: z.array(TrustedContactSchema),
});
