import { AuditLogsExportRequestSchema } from "#shared/types";
import { createError, defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../../utils/authkit-session";
import { getOrCreateOrganizationByExternalId } from "../../../../utils/workos-org";

export default defineEventHandler(async (event) => {
	await requireAuthenticatedAuthkitSession(event);
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const rawBody = (await readBody(event)) as unknown;
	const body = AuditLogsExportRequestSchema.parse(rawBody);
	const rangeStart = new Date(body.rangeStart);
	const rangeEnd = new Date(body.rangeEnd);
	if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime())) {
		throw createError({ statusCode: 400, statusMessage: "Invalid rangeStart/rangeEnd" });
	}

	const { workos } = getWorkosAuthkitConfig();
	const organization = await getOrCreateOrganizationByExternalId(workos, org);

	const exportJob = await workos.auditLogs.createExport({
		organizationId: organization.id,
		rangeStart,
		rangeEnd,
		actions: body.actions,
		actors: body.actors,
		targets: body.targets,
	});

	return { export: exportJob };
});
