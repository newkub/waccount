import { z } from "zod";

export const NotificationPreferencesSchema = z.object({
	email: z.object({
		enabled: z.boolean(),
		security: z.boolean(),
		billing: z.boolean(),
		marketing: z.boolean(),
		product: z.boolean(),
	}),
	push: z.object({
		enabled: z.boolean(),
		security: z.boolean(),
		billing: z.boolean(),
	}),
	inApp: z.object({
		enabled: z.boolean(),
		security: z.boolean(),
		billing: z.boolean(),
	}),
});

export const SecurityNotificationSchema = z.object({
	id: z.string(),
	type: z.enum(["login", "password_change", "2fa_enabled", "2fa_disabled", "new_device", "suspicious_activity"]),
	title: z.string(),
	message: z.string(),
	severity: z.enum(["info", "warning", "critical"]),
	read: z.boolean(),
	createdAt: z.string().datetime(),
});
