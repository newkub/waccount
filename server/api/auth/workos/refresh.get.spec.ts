import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { refreshSession, setAuthCookies } from '../../../utils/auth'

// Mock utilities
vi.mock('../../../utils/auth', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    refreshSession: vi.fn(),
    setAuthCookies: vi.fn(),
  }
})

const mockGetCookie = vi.fn()
const mockDeleteCookie = vi.fn()

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    getCookie: mockGetCookie,
    deleteCookie: mockDeleteCookie,
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('GET /api/auth/workos/refresh', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should refresh session and return user on success', async () => {
    // Arrange
    const oldRefreshToken = 'old_refresh_token'
    const refreshResult = {
      user: { id: 'user_123' },
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    }
    mockGetCookie.mockReturnValue(oldRefreshToken)
    vi.mocked(refreshSession).mockResolvedValue(refreshResult)

    // Act
    const response = await $fetch('/api/auth/workos/refresh', { method: 'GET' })

    // Assert
    expect(mockGetCookie).toHaveBeenCalledWith(expect.anything(), 'workos-refresh')
    expect(refreshSession).toHaveBeenCalledWith(oldRefreshToken)
    expect(setAuthCookies).toHaveBeenCalledWith(expect.anything(), refreshResult.accessToken, refreshResult.refreshToken)
    expect(response).toEqual({ user: refreshResult.user })
  })

  it('should return 401 if no refresh token is found', async () => {
    // Arrange
    mockGetCookie.mockReturnValue(undefined)

    // Act & Assert
    await expect($fetch('/api/auth/workos/refresh', { method: 'GET' })).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'No refresh token found',
    })
    expect(refreshSession).not.toHaveBeenCalled()
  })

  it('should clear cookies and return 401 if refresh fails', async () => {
    // Arrange
    const oldRefreshToken = 'invalid_token'
    const errorMessage = 'Invalid token'
    mockGetCookie.mockReturnValue(oldRefreshToken)
    vi.mocked(refreshSession).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect($fetch('/api/auth/workos/refresh', { method: 'GET' })).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: errorMessage,
    })

    expect(refreshSession).toHaveBeenCalledWith(oldRefreshToken)
    expect(setAuthCookies).not.toHaveBeenCalled()
    expect(mockDeleteCookie).toHaveBeenCalledWith(expect.anything(), 'workos-session')
    expect(mockDeleteCookie).toHaveBeenCalledWith(expect.anything(), 'workos-refresh')
  })
})
