import { getWorkOS } from '../../../lib/workos'

export default defineEventHandler(async (event) => {
  try {
    // Get user ID from cookie
    const userId = getCookie(event, 'workos_user_id')
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    const workos = getWorkOS()
    
    // Get user from ID
    const user = await workos.userManagement.getUser(userId)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid session'
      })
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.email,
        avatar: user.profilePictureUrl,
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
  } catch (error) {
    console.error('Refresh error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to refresh user',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
