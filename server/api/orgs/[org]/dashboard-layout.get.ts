import { createError, defineEventHandler } from "h3";
import { db } from "~~/server/db";
import { OrgDashboardLayoutResponseSchema } from "#shared/types";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";

const DEFAULT_LAYOUT = {
	version: 1,
	tabs: [
		{ id: "integrations", label: "Integrations", slots: [{ id: "integrations.overview", type: "org_integrations" }] },
		{ id: "members", label: "Members", slots: [{ id: "members.list", type: "org_members" }] },
		{ id: "audit-logs", label: "Audit Logs", slots: [{ id: "audit.export", type: "org_audit_export" }] },
	],
} as const;

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const row = await db.query.orgDashboardLayouts.findFirst({
		where: (t, { eq, and }) => and(eq(t.orgExternalId, org), eq(t.userId, user.id)),
	});

	const layout = row?.layout ?? DEFAULT_LAYOUT;

	return OrgDashboardLayoutResponseSchema.parse({
		orgExternalId: org,
		userId: user.id,
		layout,
	});
});
