import { z } from 'zod'
import { sealSession } from '~/server/utils/authkit-session'
import { createWorkos } from '~/server/utils/workos'

const LoginBody = z.object({
	email: z.string().email(),
	password: z.string(),
})

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, LoginBody.safeParse)

	if (!body.success) {
		throw createError({ statusCode: 400, statusMessage: 'Validation failed', data: body.error.issues })
	}

	const { email, password } = body.data
	const workos = createWorkos(event)

	try {
		const { user, sealedSession } = await workos.userManagement.authenticateWithPassword({
			clientId: useRuntimeConfig(event).public.workosClientId,
			email,
			password,
		})

		await sealSession(event, sealedSession)

		return {
			user,
		}
	} catch (error: any) {
		throw createError({
			statusCode: 401, // Unauthorized
			statusMessage: 'Authentication failed',
			data: error.message,
		})
	}
})

