import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { createWorkos } from './workos'

export const WORKOS_SESSION_COOKIE_NAME = 'wos-session'

export async function sealSession(event: H3Event, sealedSession: string) {
	const isProd = process.env.NODE_ENV === 'production'
	setCookie(event, WORKOS_SESSION_COOKIE_NAME, sealedSession, {
		httpOnly: true,
		secure: isProd,
		sameSite: 'lax',
		path: '/',
	})
}

export async function clearSession(event: H3Event) {
	deleteCookie(event, WORKOS_SESSION_COOKIE_NAME, { path: '/' })
}

export async function unsealSession(event: H3Event) {
	const sealedSession = getCookie(event, WORKOS_SESSION_COOKIE_NAME)

	if (!sealedSession) {
		return null
	}

	const workos = createWorkos(event)

	try {
		const session = await workos.userManagement.loadSealedSession(sealedSession)
		return session
	} catch {
		// Invalid session, clear it
		await clearSession(event)
		return null
	}
}

