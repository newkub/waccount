import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { clearAuthCookies } from '../../../utils/auth'

// Mock utilities
vi.mock('../../../utils/auth', () => ({
  clearAuthCookies: vi.fn(),
}))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('POST /api/auth/workos/logout', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should clear auth cookies and return success', async () => {
    // Act
    const response = await $fetch('/api/auth/workos/logout', { method: 'POST' })

    // Assert
    expect(clearAuthCookies).toHaveBeenCalledOnce()
    expect(response).toEqual({ success: true, message: 'Logged out successfully' })
  })

  it('should return 500 error if clearing cookies fails', async () => {
    // Arrange
    const errorMessage = 'Failed to clear cookies'
    vi.mocked(clearAuthCookies).mockImplementation(() => {
      throw new Error(errorMessage)
    })

    // Act & Assert
    await expect($fetch('/api/auth/workos/logout', { method: 'POST' })).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  })
})
