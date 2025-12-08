import { getWorkOS } from '../../../lib/workos'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, firstName, lastName } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    const workos = getWorkOS()

    // Create user
    const user = await workos.userManagement.createUser({
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      emailVerified: false
    })

    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user'
      })
    }

    return {
      success: true,
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
      },
      message: 'User created successfully. Please verify your email.'
    }
  } catch (error) {
    console.error('Register error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to register user',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
