import type { WorkOS } from "@workos-inc/node";

export const getOrCreateOrganizationByExternalId = async (
	workos: WorkOS,
	externalId: string,
): Promise<Awaited<ReturnType<WorkOS["organizations"]["getOrganizationByExternalId"]>>> => {
	try {
		return await workos.organizations.getOrganizationByExternalId(externalId);
	} catch {
		return await workos.organizations.createOrganization({
			name: externalId,
			externalId,
		});
	}
};
