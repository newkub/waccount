import { defineEventHandler } from 'h3';
import { unsealSession, sealSession } from '~/server/utils/authkit-session'

export default defineEventHandler(async (event) => {
	const session = await unsealSession(event)

	if (!session) {
		return { user: null }
	}

	// First, try to authenticate the session
	let authResponse = await session.authenticate()

	if (authResponse.authenticated) {
		return { user: authResponse.user }
	}

	// If authentication fails, try to refresh the session
	authResponse = await session.refresh()

	if (!authResponse.authenticated) {
		return { user: null }
	}

	// If refresh is successful, seal the new session
	if (authResponse.sealedSession) {
		await sealSession(event, authResponse.sealedSession)
	}

	return { user: authResponse.user }
})

