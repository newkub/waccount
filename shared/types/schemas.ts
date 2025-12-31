import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	emailVerified: z.boolean(),
	avatar: z.string().url().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
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
	path: ["confirmPassword"], // path of error
});

export const OrganizationSchema = z.object({
	id: z.string(),
	externalId: z.string().nullable(),
	name: z.string(),
	domains: z.array(z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const OrgMembersResponseSchema = z.object({
	organization: OrganizationSchema.pick({ id: true, externalId: true, name: true }),
	members: z.array(UserSchema),
});

export const OrgMembershipSchema = z.object({
	id: z.string(),
	userId: z.string(),
	organizationId: z.string(),
	status: z.string(),
	role: z.unknown().nullable().optional(),
});

export const OrgMembershipsResponseSchema = z.object({
	organization: OrganizationSchema.pick({ id: true, externalId: true, name: true }),
	memberships: z.array(OrgMembershipSchema),
});

export const SsoConnectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	state: z.string(),
	domains: z.array(z.string()).optional(),
});

export const DirectorySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	state: z.string(),
	organizationId: z.string(),
});

export const OrgIntegrationsResponseSchema = z.object({
	organization: OrganizationSchema.pick({ id: true, externalId: true, name: true }),
	ssoConnections: z.array(SsoConnectionSchema),
	directories: z.array(DirectorySchema),
	portals: z.object({
		sso: z.string().url(),
		dsync: z.string().url(),
		auditLogs: z.string().url(),
	}),
});

export const AuditLogsExportRequestSchema = z.object({
	rangeStart: z.string().datetime(),
	rangeEnd: z.string().datetime(),
	actions: z.array(z.string()).optional(),
	actors: z.array(z.string()).optional(),
	targets: z.array(z.string()).optional(),
});

export const DashboardSlotSchema = z.object({
	id: z.string(),
	type: z.string(),
	config: z.record(z.string(), z.unknown()).optional(),
});

export const DashboardTabSchema = z.object({
	id: z.string(),
	label: z.string(),
	hidden: z.boolean().optional(),
	slots: z.array(DashboardSlotSchema),
});

export const DashboardLayoutSchema = z.object({
	version: z.number().int().positive(),
	tabs: z.array(DashboardTabSchema),
});

export const OrgDashboardLayoutResponseSchema = z.object({
	orgExternalId: z.string(),
	userId: z.string(),
	layout: DashboardLayoutSchema,
});

export const OrgDashboardLayoutUpsertRequestSchema = z.object({
	layout: DashboardLayoutSchema,
});

export const OrgHealthResponseSchema = z.object({
	orgExternalId: z.string(),
	organizationId: z.string(),
	ssoConnections: z.object({
		count: z.number().int().nonnegative(),
		activeCount: z.number().int().nonnegative(),
		inactiveCount: z.number().int().nonnegative(),
	}),
	directories: z.object({
		count: z.number().int().nonnegative(),
		healthyCount: z.number().int().nonnegative(),
		unhealthyCount: z.number().int().nonnegative(),
	}),
	generatedAt: z.string().datetime(),
});
