import { createError, defineEventHandler } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { OrgIntegrationsResponseSchema } from "#shared/types";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";
import { getOrCreateOrganizationByExternalId } from "../../../utils/workos-org";

export default defineEventHandler(async (event) => {
	await requireAuthenticatedAuthkitSession(event);
	const runtimeConfig = useRuntimeConfig(event);
	const baseUrl = typeof runtimeConfig.public.baseUrl === "string" ? runtimeConfig.public.baseUrl : "";
	const dashboardUrl = baseUrl ? new URL("/dashboard", baseUrl).toString() : "/dashboard";
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const { workos } = getWorkosAuthkitConfig();
	const organization = await getOrCreateOrganizationByExternalId(workos, org);

	const [connections, directories, portals] = await Promise.all([
		workos.sso.listConnections({ organizationId: organization.id, limit: 50 }),
		workos.directorySync.listDirectories({ organizationId: organization.id, limit: 50 }),
		Promise.all([
			workos.portal.generateLink({
				intent: "sso" as any,
				organization: organization.id,
				returnUrl: dashboardUrl,
			}),
			workos.portal.generateLink({
				intent: "dsync" as any,
				organization: organization.id,
				returnUrl: dashboardUrl,
			}),
			workos.portal.generateLink({
				intent: "audit_logs" as any,
				organization: organization.id,
				successUrl: dashboardUrl,
			}),
		]),
	]);

	return OrgIntegrationsResponseSchema.parse({
		organization: {
			id: organization.id,
			externalId: organization.externalId ?? null,
			name: organization.name,
		},
		ssoConnections: connections.data.map((c) => ({
			id: c.id,
			name: c.name,
			type: c.type,
			state: c.state,
			domains: c.domains,
		})),
		directories: directories.data.map((d) => ({
			id: d.id,
			name: d.name,
			type: d.type,
			state: d.state,
			organizationId: d.organizationId,
		})),
		portals: {
			sso: portals[0].link,
			dsync: portals[1].link,
			auditLogs: portals[2].link,
		},
	});
});
