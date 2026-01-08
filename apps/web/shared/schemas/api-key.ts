import { z } from "zod";

export const ApiKeySchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	scopes: z.array(z.string()),
	createdAt: z.string().datetime(),
	lastUsedAt: z.string().datetime().nullable().optional(),
	expiresAt: z.string().datetime().nullable().optional(),
});
