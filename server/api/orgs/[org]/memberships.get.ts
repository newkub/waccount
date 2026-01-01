import { createError, defineEventHandler } from "h3";
import { OrgMembershipsResponseSchema } from "#shared/types";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";
import { getOrCreateOrganizationByExternalId } from "../../../utils/workos-org";

export default defineEventHandler(async (event) => {
	await requireAuthenticatedAuthkitSession(event);
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const { workos } = getWorkosAuthkitConfig();
	const organization = await getOrCreateOrganizationByExternalId(workos, org);

	const memberships = await workos.userManagement.listOrganizationMemberships({
		organizationId: organization.id,
		limit: 50,
	});

	return OrgMembershipsResponseSchema.parse({
		organization: {
			id: organization.id,
			externalId: organization.externalId ?? null,
			name: organization.name,
		},
		memberships: memberships.data.map((m) => ({
			id: m.id,
			userId: m.userId,
			organizationId: m.organizationId,
			status: m.status,
			role: m.role,
		})),
	});
});
