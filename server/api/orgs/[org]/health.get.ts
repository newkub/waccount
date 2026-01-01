import { OrgHealthResponseSchema } from "#shared/types";
import { createError, defineEventHandler } from "h3";
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

	const [connections, directories] = await Promise.all([
		workos.sso.listConnections({ organizationId: organization.id, limit: 50 }),
		workos.directorySync.listDirectories({ organizationId: organization.id, limit: 50 }),
	]);

	const connectionStates = connections.data.map((c: any) => String(c?.state ?? ""));
	const activeCount = connectionStates.filter((s) => s.toLowerCase() === "active").length;
	const inactiveCount = connectionStates.length - activeCount;

	const directoryStates = directories.data.map((d: any) => String(d?.state ?? ""));
	const healthyCount = directoryStates.filter((s) => s.toLowerCase() === "active").length;
	const unhealthyCount = directoryStates.length - healthyCount;

	return OrgHealthResponseSchema.parse({
		orgExternalId: org,
		organizationId: organization.id,
		ssoConnections: {
			count: connections.data.length,
			activeCount,
			inactiveCount,
		},
		directories: {
			count: directories.data.length,
			healthyCount,
			unhealthyCount,
		},
		generatedAt: new Date().toISOString(),
	});
});
