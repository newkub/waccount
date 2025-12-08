import { getWorkOS } from '../../../lib/workos'

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, 'workos_user_id')
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    const workos = getWorkOS()
    
    const user = await workos.userManagement.getUser(userId)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    return {
      profile: {
        id: user.id,
        email: user.email,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.email,
        avatar: user.profilePictureUrl,
        bio: '',
        phone: '',
        company: '',
        location: '',
        website: '',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Profile fetch error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch profile',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
