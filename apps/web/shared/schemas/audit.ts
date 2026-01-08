import { z } from "zod";

export const AuditLogsExportRequestSchema = z.object({
	rangeStart: z.string().datetime(),
	rangeEnd: z.string().datetime(),
	actions: z.array(z.string()).optional(),
	actors: z.array(z.string()).optional(),
	targets: z.array(z.string()).optional(),
});

export const AuditReportSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["activity", "security", "billing", "compliance"]),
	dateRange: z.object({
		start: z.string().datetime(),
		end: z.string().datetime(),
	}),
	format: z.enum(["pdf", "csv", "json"]),
	status: z.enum(["generating", "ready", "failed"]),
	fileUrl: z.string().url().nullable().optional(),
	createdAt: z.string().datetime(),
	generatedAt: z.string().datetime().nullable().optional(),
});
