export default defineEventHandler(async (event) => {
  try {
    // Clear session cookie
    deleteCookie(event, 'workos_session')
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error) {
    console.error('Logout error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to logout',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
