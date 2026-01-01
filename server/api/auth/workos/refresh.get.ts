import { defineEventHandler } from "h3";
import { loadSessionFromCookie, setSealedSessionCookie } from "../../../utils/authkit-session";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const session = await loadSessionFromCookie(event);
	if (!session) {
		return { user: null };
	}

	const authResponse = await session.authenticate();
	if (authResponse.authenticated) {
		return { user: mapWorkosUserToAppUser(authResponse.user) };
	}

	const refreshResponse = await session.refresh();
	if (!refreshResponse.authenticated) {
		return { user: null };
	}

	if (refreshResponse.sealedSession) {
		setSealedSessionCookie(event, refreshResponse.sealedSession);
	}

	return { user: mapWorkosUserToAppUser(refreshResponse.user) };
});
