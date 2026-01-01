import { createError, defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);

	const body = await readBody<{ firstName?: string; lastName?: string }>(event);
	if (!body || (!body.firstName && !body.lastName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "No profile fields provided",
		});
	}

	const { workos } = getWorkosAuthkitConfig();

	const updated = await workos.userManagement.updateUser({
		userId: user.id,
		firstName: body.firstName,
		lastName: body.lastName,
	});

	return { profile: mapWorkosUserToAppUser(updated) };
});
