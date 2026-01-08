import { z } from "zod";

export const SupportTicketSchema = z.object({
	id: z.string(),
	subject: z.string(),
	message: z.string(),
	category: z.enum(["billing", "technical", "account", "feature", "bug"]),
	status: z.enum(["open", "in_progress", "resolved", "closed"]),
	priority: z.enum(["low", "medium", "high", "urgent"]),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	messages: z.array(z.any()).optional(),
});
