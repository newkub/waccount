import { z } from "zod";

export const DataExportRequestSchema = z.object({
	format: z.enum(["json", "csv"]),
	include: z.array(z.string()),
});

export const DataExportSchema = z.object({
	id: z.string(),
	status: z.enum(["pending", "processing", "completed", "failed"]),
	format: z.enum(["json", "csv"]),
	fileUrl: z.string().url().nullable().optional(),
	createdAt: z.string().datetime(),
	completedAt: z.string().datetime().nullable().optional(),
});
