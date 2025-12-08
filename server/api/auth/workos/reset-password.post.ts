import { getWorkOS } from '../../../lib/workos'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    const workos = getWorkOS()
    const config = useRuntimeConfig()

    // Send password reset email
    await workos.userManagement.sendPasswordResetEmail({
      email,
      passwordResetUrl: `${config.public.appUrl}/auth/reset-password`
    })

    return {
      success: true,
      message: 'Password reset email sent'
    }
  } catch (error) {
    console.error('Reset password error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send reset email',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
