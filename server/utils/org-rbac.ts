import type { H3Event } from "h3";
import type { OrgRole } from "~/shared/types/org";
import { createError } from "h3";
import { requireAuthenticatedAuthkitSession } from "./authkit-guard";
import { getWorkosAuthkitConfig } from "./authkit-session";
import { getOrCreateOrganizationByExternalId } from "./workos-org";


const normalizeRole = (role: unknown): OrgRole | null => {
	if (typeof role !== "string") return null;
	const r = role.toLowerCase();
	if (r === "owner") return "owner";
	if (r === "admin") return "admin";
	if (r === "member") return "member";
	return null;
};

export const requireOrgRole = async (
	event: H3Event,
	orgExternalId: string,
	allowedRoles: readonly OrgRole[],
) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const { workos } = getWorkosAuthkitConfig();
	const organization = await getOrCreateOrganizationByExternalId(workos, orgExternalId);

	const memberships = await workos.userManagement.listOrganizationMemberships({
		organizationId: organization.id,
		userId: user.id,
	});

	const membership = memberships.data[0] ?? null;
	if (!membership) {
		throw createError({ statusCode: 403, statusMessage: "Not a member of this organization" });
	}

	const role = normalizeRole((membership as any).role);
	if (!role || !allowedRoles.includes(role)) {
		throw createError({ statusCode: 403, statusMessage: "Insufficient permissions" });
	}

	return { organization, membership, role, user };
};
