import type { WorkOS } from "@workos-inc/node";
import type { AccountOrganization, User as AppUser } from "../../shared/types";
import { mapWorkosUserToAppUser } from "../utils/workos-user";

// A simple in-memory cache to avoid fetching the same organization multiple times
const orgCache = new Map<string, any>();

async function getOrganization(workos: WorkOS, orgId: string) {
	if (orgCache.has(orgId)) {
		return orgCache.get(orgId);
	}
	const org = await workos.organizations.getOrganization(orgId);
	orgCache.set(orgId, org);
	return org;
}

export async function listOrganizationsForUser(workos: WorkOS, userId: string): Promise<AccountOrganization[]> {
	const organizationMemberships = await workos.userManagement.listOrganizationMemberships({
		userId,
	});

	return Promise.all(
		organizationMemberships.data.map(async (membership) => {
			const org = await getOrganization(workos, membership.organizationId);
			// TODO: Fetching member count for each organization can be inefficient.
			// Consider optimizing this by fetching counts in a separate, dedicated call if possible,
			// or storing member counts in your own database.
			const memberships = await workos.userManagement.listOrganizationMemberships({ organizationId: org.id });

			return {
				id: org.id,
				name: org.name,
				role: membership.role.slug,
				plan: "enterprise", // Placeholder - requires billing integration
				memberCount: memberships.data.length, // This only counts up to the pagination limit
			};
		}),
	);
}

export async function listMembers(workos: WorkOS, organizationId: string): Promise<AppUser[]> {
	const memberships = await workos.userManagement.listOrganizationMemberships({
		organizationId,
		limit: 50,
	});

	return Promise.all(
		memberships.data.map(async (m) => {
			const user = await workos.userManagement.getUser(m.userId);
			return mapWorkosUserToAppUser(user);
		}),
	);
}
