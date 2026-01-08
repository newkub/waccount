import { z } from "zod";

export const ResetPasswordRequestSchema = z.object({
	token: z.string(),
	newPassword: z.string().min(8),
});

export const ForgotPasswordRequestSchema = z.object({
	email: z.string().email(),
});

export const VerifyEmailRequestSchema = z.object({
	token: z.string(),
});

export const TwoFactorSetupRequestSchema = z.object({
	method: z.enum(["totp", "sms"]),
	phoneNumber: z.string().optional(),
});

export const TwoFactorVerifyRequestSchema = z.object({
	code: z.string(),
});

export const ChangePasswordRequestSchema = z.object({
	currentPassword: z.string(),
	newPassword: z.string().min(8),
});

export const DeleteAccountRequestSchema = z.object({
	password: z.string(),
	reason: z.string().optional(),
});
