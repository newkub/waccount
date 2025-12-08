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

    // Send magic link
    await workos.userManagement.sendMagicAuthCode({
      email
    })

    return {
      success: true,
      message: 'Magic link sent to your email'
    }
  } catch (error) {
    console.error('Magic link error:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send magic link',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
