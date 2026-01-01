import type { z } from "zod";
import type { UpdateProfileDataSchema, UserSchema } from "./schemas";

export type User = z.infer<typeof UserSchema>;
export type UserProfile = User;
export type UpdateProfileData = z.infer<typeof UpdateProfileDataSchema>;

export interface UserActivity {
	id: string;
	type: string;
	timestamp: string;
	[key: string]: unknown;
}

// Types from formerly account.ts
export interface Activity {
	id: string;
	type: "login" | "password" | "profile" | "organization" | "security" | "connection";
	action: string;
	description: string;
	timestamp: string;
	ipAddress: string;
	location: string;
	userAgent: string;
	success: boolean;
	metadata?: Record<string, any>;
}

export interface Metadata {
	provider?: string;
	sessionId?: string;
	method?: string;
	fields?: string[];
	reason?: string;
	email?: string;
	organizationId?: string;
	role?: string;
}

export interface Subscription {
	id: string;
	plan: string;
	status: "active" | "canceled" | "past_due";
	currentPeriodStart: string;
	currentPeriodEnd: string;
	cancelAtPeriodEnd: boolean;
	amount: number;
	currency: string;
	features: string[];
}

export interface Invoice {
	id: string;
	date: string;
	amount: number;
	currency: string;
	status: "paid" | "pending" | "failed";
	description: string;
	downloadUrl: string;
}

export interface UsageMetric {
	current: number | string;
	limit: number | string;
	percentage: number;
}

export interface Usage {
	users: UsageMetric;
	api: UsageMetric;
	storage: UsageMetric;
	integrations: UsageMetric;
}

export interface Connection {
	id: string;
	provider: string;
	type: "sso" | "integration";
	status: "active" | "error" | "expired";
	email: string;
	connectedAt: string;
	lastUsed: string;
	permissions: string[];
	workspace?: string;
}

export interface Provider {
	id: string;
	name: string;
	type: "sso" | "integration";
	description: string;
	icon: string;
	color: string;
}

export interface UserOrganization {
	id: string;
	name: string;
	role: "admin" | "member" | "owner";
	members: number;
	createdAt: string;
	domain?: string;
}

export interface Invitation {
	id: string;
	organizationName: string;
	role: string;
	invitedBy: string;
	createdAt: string;
}

export interface UserPreferences {
	emailNotifications: boolean;
	marketingEmails: boolean;
	twoFactorEnabled: boolean;
}

export interface AccountOrganization {
	id: string;
	name: string;
	role: string;
	plan: string;
	memberCount: number;
}
