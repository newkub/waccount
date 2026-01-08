import { z } from "zod";

export const DeviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["desktop", "mobile", "tablet"]),
	browser: z.string(),
	os: z.string(),
	ipAddress: z.string().optional(),
	location: z.string().optional(),
	lastSeenAt: z.string().datetime(),
	isCurrent: z.boolean(),
});
