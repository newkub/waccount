import { defineEventHandler } from "h3";
import { listOrganizationsForUser } from "../../../lib/orgs";
import { unsealSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const session = await unsealSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	const authResponse = await session.authenticate();
	if (!authResponse.authenticated) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}
	const { user } = authResponse;

	const workos = createWorkos(event);
	return listOrganizationsForUser(workos, user.id);
});
