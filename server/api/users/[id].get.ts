import { createError, defineEventHandler } from "h3";
import { getWorkosAuthkitConfig } from "../../utils/authkit-session";
import { mapWorkosUserToAppUser } from "../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: "Missing user id" });
	}

	const { workos } = getWorkosAuthkitConfig();
	const user = await workos.userManagement.getUser(id);

	return { user: mapWorkosUserToAppUser(user) };
});
