import { z } from "zod";

export const SessionSchema = z.object({
	id: z.string(),
	device: z.string(),
	browser: z.string(),
	os: z.string(),
	ipAddress: z.string().optional(),
	location: z.string().optional(),
	createdAt: z.string().datetime(),
	lastActiveAt: z.string().datetime(),
	isCurrent: z.boolean(),
});
