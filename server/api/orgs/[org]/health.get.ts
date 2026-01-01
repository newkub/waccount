import { createError, defineEventHandler } from "h3";
import { OrgHealthResponseSchema } from "../../../../shared/schemas";
import { createWorkos } from "../../../utils/workos";
import { getOrCreateOrganizationByExternalId } from "../../../utils/workos-org";

export default defineEventHandler(async (event) => {
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const countActiveInactive = <T extends { state?: unknown }>(items: readonly T[]) => {
		const activeCount = items.filter((item) =>
			typeof item.state === "string" && item.state.toLowerCase() === "active"
		).length;
		const inactiveCount = items.length - activeCount;
		return { count: items.length, activeCount, inactiveCount };
	};

	const workos = createWorkos(event);
	const organization = await getOrCreateOrganizationByExternalId(workos, org);

	const [connections, directories] = await Promise.all([
		workos.sso.listConnections({ organizationId: organization.id, limit: 50 }),
		workos.directorySync.listDirectories({ organizationId: organization.id, limit: 50 }),
	]);
	const ssoCounts = countActiveInactive(connections.data);
	const directoryCounts = countActiveInactive(directories.data);

	return OrgHealthResponseSchema.parse({
		orgExternalId: org,
		organizationId: organization.id,
		ssoConnections: {
			count: ssoCounts.count,
			activeCount: ssoCounts.activeCount,
			inactiveCount: ssoCounts.inactiveCount,
		},
		directories: {
			count: directoryCounts.count,
			healthyCount: directoryCounts.activeCount,
			unhealthyCount: directoryCounts.inactiveCount,
		},
		generatedAt: new Date().toISOString(),
	});
});
