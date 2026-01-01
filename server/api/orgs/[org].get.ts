import { createError, defineEventHandler } from "h3";
import { OrganizationSchema } from "#shared/types";
import { requireAuthenticatedAuthkitSession } from "../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../utils/authkit-session";
import { getOrCreateOrganizationByExternalId } from "../../utils/workos-org";

export default defineEventHandler(async (event) => {
	await requireAuthenticatedAuthkitSession(event);
	const org = event.context.params?.org;
	if (!org) {
		throw createError({ statusCode: 400, statusMessage: "Missing org" });
	}

	const { workos } = getWorkosAuthkitConfig();
	const organization = await getOrCreateOrganizationByExternalId(workos, org);
	const domains = (organization.domains ?? []).map((d: any) => typeof d?.domain === "string" ? d.domain : String(d));

	return {
		organization: OrganizationSchema.parse({
			id: organization.id,
			externalId: organization.externalId ?? null,
			name: organization.name,
			domains,
			metadata: (organization as any).metadata ?? null,
		}),
	};
});
