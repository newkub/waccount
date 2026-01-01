import { useRuntimeConfig } from "nitropack/runtime";
import { clearSession } from "../../../utils/authkit-session";
import { createWorkos } from "../../../utils/workos";

export default defineEventHandler(async (event) => {
	const sealedSession = getCookie(event, "wos-session");

	if (!sealedSession) {
		return { success: true };
	}

	const workos = createWorkos(event);

	try {
		const { workosCookiePassword } = useRuntimeConfig(event);
		const session = workos.userManagement.loadSealedSession({
			sessionData: sealedSession,
			cookiePassword: workosCookiePassword,
		});
		const logoutUrl = await session.getLogoutUrl();

		await clearSession(event);

		return { success: true, logoutUrl };
	} catch { // eslint-disable-line no-empty
		// If the session is invalid, clear it anyway
		await clearSession(event);
		return { success: true };
	}
});
