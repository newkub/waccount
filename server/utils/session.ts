import type { H3Event } from "h3";
import { unsealSession } from "./authkit-session";

export async function ensureUserHasOrganization(event: H3Event): Promise<string> {
	const session = await unsealSession(event);

	// The session object from WorkOS has the organizationId at the top level.
	// We cast to `any` to bypass the incomplete type definition.
	const organizationId = (session as any)?.organizationId;

	if (!organizationId) {
		throw createError({ statusCode: 401, statusMessage: "User is not part of an organization." });
	}

	return organizationId;
}
