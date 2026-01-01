import { createError, defineEventHandler } from "h3";
import { OrgMembersResponseSchema } from "#shared/types";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";
import { getOrCreateOrganizationByExternalId } from "../../../utils/workos-org";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

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

	const members = await Promise.all(
		memberships.data.map(async (m) => {
			const user = await workos.userManagement.getUser(m.userId);
			return mapWorkosUserToAppUser(user);
		}),
	);

	return OrgMembersResponseSchema.parse({
		organization: {
			id: organization.id,
			externalId: organization.externalId ?? null,
			name: organization.name,
		},
		members,
	});
});
