import { defineEventHandler } from "h3";
import { sealSession, unsealSession } from "../../../utils/authkit-session";

export default defineEventHandler(async (event) => {
	const session = await unsealSession(event);

	if (!session) {
		return { user: null };
	}

	// First, try to authenticate the session
	const authResponse = await session.authenticate();

	if (authResponse.authenticated) {
		return { user: authResponse.user };
	}

	// If authentication fails, try to refresh the session
	const refreshResponse = await session.refresh();

	if (!refreshResponse.authenticated) {
		return { user: null };
	}

	// If refresh is successful, seal the new session
	if (refreshResponse.sealedSession) {
		await sealSession(event, refreshResponse.sealedSession);
	}

	return { user: refreshResponse.user };
});
