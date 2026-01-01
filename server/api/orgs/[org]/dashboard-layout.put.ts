import { OrgDashboardLayoutResponseSchema, OrgDashboardLayoutUpsertRequestSchema } from "#shared/types";
import { and, eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { randomUUID } from "node:crypto";
import { db } from "~~/server/db";
import { orgDashboardLayouts } from "../../../db/schema";
import { requireOrgRole } from "../../../utils/org-rbac";

export default defineEventHandler(async (event) => {
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const { user } = await requireOrgRole(event, org, ["owner", "admin"]);

	const rawBody = (await readBody(event)) as unknown;
	const body = OrgDashboardLayoutUpsertRequestSchema.parse(rawBody);

	const existing = await db.query.orgDashboardLayouts.findFirst({
		where: (t, { eq, and }) => and(eq(t.orgExternalId, org), eq(t.userId, user.id)),
	});

	if (!existing) {
		await db.insert(orgDashboardLayouts).values({
			id: randomUUID(),
			orgExternalId: org,
			userId: user.id,
			layout: body.layout,
		});
	} else {
		await db
			.update(orgDashboardLayouts)
			.set({ layout: body.layout, updatedAt: new Date() })
			.where(and(eq(orgDashboardLayouts.orgExternalId, org), eq(orgDashboardLayouts.userId, user.id)));
	}

	return OrgDashboardLayoutResponseSchema.parse({
		orgExternalId: org,
		userId: user.id,
		layout: body.layout,
	});
});
