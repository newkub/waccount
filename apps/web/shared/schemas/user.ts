import { z } from "zod";

export const UserPreferencesSchema = z.object({
	emailNotifications: z.boolean().default(true),
	marketingEmails: z.boolean().default(false),
	twoFactorEnabled: z.boolean().default(false),
});

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	emailVerified: z.boolean(),
	avatar: z.string().url().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	preferences: UserPreferencesSchema.optional().nullable(),
	metadata: z.record(z.string(), z.any()).optional().nullable(),
});

export const UpdateProfileDataSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	avatar: z.string().url().optional(),
});

export const LoginFormDataSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
});

export const RegisterFormDataSchema = LoginFormDataSchema.extend({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	confirmPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

export const UserPreferencesExtendedSchema = z.object({
	language: z.string().default("en"),
	timezone: z.string().default("UTC"),
	dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("YYYY-MM-DD"),
	theme: z.enum(["light", "dark", "system"]).default("system"),
	highContrast: z.boolean().default(false),
	reducedMotion: z.boolean().default(false),
	fontSize: z.enum(["small", "medium", "large"]).default("medium"),
});
