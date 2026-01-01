import { defineEventHandler, getQuery } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../utils/authkit-guard";
import { createWorkos } from "../../utils/workos";
import { getOrCreateOrganizationByExternalId } from "../../utils/workos-org";
import { mapWorkosUserToAppUser } from "../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);

	const query = getQuery(event);
	const org = typeof query.org === "string" ? query.org : null;
	const project = typeof query.project === "string" ? query.project : null;

	const workspaceId = org ? `${org}/${project ?? ""}` : `${project ?? ""}`;

	const organization = org
		? await getOrCreateOrganizationByExternalId(workos, org)
		: null;

	const organizationId = organization?.id ?? null;

	const members = await (async () => {
		if (!organizationId) {
			return [mapWorkosUserToAppUser(user)];
		}

		const memberships = await workos.userManagement.listOrganizationMemberships({
			organizationId,
			limit: 50,
		});

		const users = await Promise.all(
			memberships.data.map(async (m) => {
				const u = await workos.userManagement.getUser(m.userId);
				return mapWorkosUserToAppUser(u);
			}),
		);

		return users;
	})();

	return {
		workspace: {
			id: workspaceId,
			org,
			project,
		},
		organization: organization
			? {
				id: organization.id,
				externalId: organization.externalId ?? null,
				name: organization.name,
				domains: (organization.domains ?? []).map((d: any) => typeof d?.domain === "string" ? d.domain : String(d)),
				metadata: (organization as any).metadata ?? null,
			}
			: null,
		members,
	};
});
