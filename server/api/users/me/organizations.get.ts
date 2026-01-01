import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../utils/authkit-session";
import type { AccountOrganization } from "../../../shared/types";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const { workos } = getWorkosAuthkitConfig();

	const organizationMemberships = await workos.userManagement.listOrganizationMemberships({
		userId: user.id,
	});

	const organizations: AccountOrganization[] = await Promise.all(
		organizationMemberships.data.map(async (membership) => {
			const org = await workos.organizations.getOrganization(membership.organizationId);
			// NOTE: 'plan' and 'memberCount' are not standard fields in the WorkOS organization object.
			// This might need to be fetched from another source or stored in metadata.
			// Using placeholder values for now.
			return {
				id: org.id,
				name: org.name,
				role: membership.role.slug,
				plan: "enterprise", // Placeholder
				memberCount: 0, // Placeholder - would require another API call to list members
			};
		})
	);

	return organizations;
});
