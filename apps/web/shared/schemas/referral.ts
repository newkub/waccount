import { z } from "zod";

export const ReferralSchema = z.object({
	id: z.string(),
	code: z.string(),
	referralCount: z.number().int().nonnegative(),
	totalRewards: z.number().nonnegative(),
	createdAt: z.string().datetime(),
});

export const ReferralHistorySchema = z.object({
	id: z.string(),
	referredEmail: z.string().email(),
	status: z.enum(["pending", "completed", "rewarded"]),
	reward: z.number().nonnegative(),
	createdAt: z.string().datetime(),
});
