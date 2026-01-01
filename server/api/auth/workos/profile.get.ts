import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	return { user: mapWorkosUserToAppUser(user) };
});
