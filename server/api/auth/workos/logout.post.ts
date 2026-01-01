import { clearSession } from '~/server/utils/authkit-session'
import { createWorkos } from '~/server/utils/workos'

export default defineEventHandler(async (event) => {
	const sealedSession = getCookie(event, 'wos-session')

	if (!sealedSession) {
		return { success: true }
	}

	const workos = createWorkos(event)

	try {
		const session = await workos.userManagement.loadSealedSession(sealedSession)
		const logoutUrl = await session.getLogoutUrl()

		await clearSession(event)

		return { success: true, logoutUrl }
	} catch { // eslint-disable-line no-empty
		// If the session is invalid, clear it anyway
		await clearSession(event)
		return { success: true }
	}
})
