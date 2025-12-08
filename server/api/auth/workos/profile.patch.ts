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

    const body = await readBody(event)
    const { firstName, lastName, profilePictureUrl } = body

    const workos = getWorkOS()
    
    const user = await workos.userManagement.getUser(userId)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    // Update user
    const updateData: any = {
      userId,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
    }
    if (profilePictureUrl) {
      updateData.profilePictureUrl = profilePictureUrl
    }
    const updatedUser = await workos.userManagement.updateUser(updateData)

    return {
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.firstName && updatedUser.lastName 
          ? `${updatedUser.firstName} ${updatedUser.lastName}` 
          : updatedUser.email,
        avatar: updatedUser.profilePictureUrl,
        bio: '',
        phone: '',
        company: '',
        location: '',
        website: '',
        createdAt: updatedUser.createdAt || new Date().toISOString(),
        updatedAt: updatedUser.updatedAt || new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Profile update error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
