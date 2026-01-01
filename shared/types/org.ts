import type { z } from "zod";
import type {
	AuditLogsExportRequestSchema,
	DirectorySchema,
	OrganizationSchema,
	OrgDashboardLayoutResponseSchema,
	OrgDashboardLayoutUpsertRequestSchema,
	OrgHealthResponseSchema,
	OrgIntegrationsResponseSchema,
	OrgMembershipSchema,
	OrgMembershipsResponseSchema,
	OrgMembersResponseSchema,
	SsoConnectionSchema,
} from "../schemas";

export type Organization = z.infer<typeof OrganizationSchema>;
export type SsoConnection = z.infer<typeof SsoConnectionSchema>;
export type Directory = z.infer<typeof DirectorySchema>;

export type OrgMembersResponse = z.infer<typeof OrgMembersResponseSchema>;
export type OrgMembership = z.infer<typeof OrgMembershipSchema>;
export type OrgMembershipsResponse = z.infer<typeof OrgMembershipsResponseSchema>;
export type OrgIntegrationsResponse = z.infer<typeof OrgIntegrationsResponseSchema>;

export type AuditLogsExportRequest = z.infer<typeof AuditLogsExportRequestSchema>;

export type OrgDashboardLayoutResponse = z.infer<typeof OrgDashboardLayoutResponseSchema>;
export type OrgDashboardLayoutUpsertRequest = z.infer<typeof OrgDashboardLayoutUpsertRequestSchema>;

export type OrgHealthResponse = z.infer<typeof OrgHealthResponseSchema>;

export type OrgRole = "owner" | "admin" | "member";
