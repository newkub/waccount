import { z } from "zod";

export const PlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	price: z.number().nonnegative(),
	currency: z.string(),
	interval: z.enum(["month", "year"]),
	features: z.array(z.string()),
	popular: z.boolean().default(false),
	limits: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
});

export const SubscriptionSchema = z.object({
	id: z.string(),
	planId: z.string(),
	status: z.enum(["active", "canceled", "past_due", "trialing"]),
	currentPeriodStart: z.string().datetime(),
	currentPeriodEnd: z.string().datetime(),
	cancelAtPeriodEnd: z.boolean(),
	amount: z.number().nonnegative(),
	currency: z.string(),
	features: z.array(z.string()),
});

export const InvoiceSchema = z.object({
	id: z.string(),
	subscriptionId: z.string(),
	date: z.string().datetime(),
	amount: z.number().nonnegative(),
	currency: z.string(),
	status: z.enum(["paid", "pending", "failed"]),
	description: z.string(),
	downloadUrl: z.string().url(),
});

export const UsageMetricSchema = z.object({
	current: z.union([z.number(), z.string()]),
	limit: z.union([z.number(), z.string()]),
	percentage: z.number().min(0).max(100),
});

export const UsageSchema = z.object({
	users: UsageMetricSchema,
	api: UsageMetricSchema,
	storage: UsageMetricSchema,
	integrations: UsageMetricSchema,
	bandwidth: UsageMetricSchema.optional(),
});
