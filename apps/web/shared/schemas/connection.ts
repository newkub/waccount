import { z } from "zod";

export const ThirdPartyConnectionSchema = z.object({
	id: z.string(),
	provider: z.enum(["slack", "discord", "notion", "github", "google"]),
	name: z.string(),
	status: z.enum(["connected", "disconnected", "error"]),
	connectedAt: z.string().datetime(),
	lastSyncedAt: z.string().datetime().nullable().optional(),
	settings: z.record(z.string(), z.any()).optional().nullable(),
});
