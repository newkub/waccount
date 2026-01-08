import { z } from "zod";

export const ActivitySchema = z.object({
	id: z.string(),
	type: z.enum(["login", "password", "profile", "organization", "security", "connection", "billing", "api"]),
	action: z.string(),
	description: z.string(),
	timestamp: z.string().datetime(),
	ipAddress: z.string().optional(),
	location: z.string().optional(),
	userAgent: z.string().optional(),
	success: z.boolean(),
	metadata: z.record(z.string(), z.any()).optional().nullable(),
});
