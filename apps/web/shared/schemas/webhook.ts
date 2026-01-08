import { z } from "zod";

export const WebhookSchema = z.object({
	id: z.string(),
	url: z.string().url(),
	events: z.array(z.string()),
	secret: z.string(),
	active: z.boolean(),
	createdAt: z.string().datetime(),
	lastTriggeredAt: z.string().datetime().nullable().optional(),
});

export const WebhookDeliveryLogSchema = z.object({
	id: z.string(),
	webhookId: z.string(),
	event: z.string(),
	status: z.enum(["success", "failed", "retrying"]),
	responseCode: z.number().int().optional(),
	responseBody: z.string().optional(),
	attemptCount: z.number().int().nonnegative(),
	sentAt: z.string().datetime(),
	deliveredAt: z.string().datetime().nullable().optional(),
});
