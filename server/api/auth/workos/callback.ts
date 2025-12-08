import { getWorkOS, getWorkOSClientId, getWorkOSRedirectUri } from '../../../lib/workos'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as Record<string, string | string[]>
    const code = query.code as string
    const _state = query.state as string | undefined
    const error = query.error as string | undefined

    console.log('[WorkOS Callback] Received query params:', { code: !!code, error, state: !!_state })

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OAuth error from provider',
        data: {
          error,
          errorDescription: query.error_description
        }
      })
    }

    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing authorization code'
      })
    }

    const workos = getWorkOS()
    const clientId = getWorkOSClientId()
    const _redirectUri = getWorkOSRedirectUri()

    // Exchange code for token
    const response = await workos.userManagement.authenticateWithCode({
      code,
      clientId
    })

    if (!response || !response.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to authenticate with WorkOS'
      })
    }

    // Set session cookie (if available)
    const sessionToken = (response as any).sessionToken || (response as any).token || ''
    if (sessionToken) {
      setCookie(event, 'workos_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    // Return user data
    return {
      success: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.firstName && response.user.lastName 
          ? `${response.user.firstName} ${response.user.lastName}` 
          : response.user.email,
        avatar: response.user.profilePictureUrl,
        emailVerified: response.user.emailVerified || false,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      }
    }
  } catch (error) {
    console.error('Callback error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process OAuth callback',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
