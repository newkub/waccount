import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { signInWithPassword, setAuthCookies } from '../../../utils/auth'
import { readValidatedBody } from '../../../utils/api'

// Mock utilities
vi.mock('../../../utils/auth', () => ({
  signInWithPassword: vi.fn(),
  setAuthCookies: vi.fn(),
}))
vi.mock('../../../utils/api', () => ({
  readValidatedBody: vi.fn(),
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

describe('POST /api/auth/workos/password', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should authenticate, set cookies, and return user on success', async () => {
    // Arrange
    const body = { email: 'test@example.com', password: 'password123' }
    const authResult = {
      user: { id: 'user_123', email: body.email },
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(signInWithPassword).mockResolvedValue(authResult)

    // Act
    const response = await $fetch('/api/auth/workos/password', { method: 'POST', body })

    // Assert
    expect(readValidatedBody).toHaveBeenCalledOnce()
    expect(signInWithPassword).toHaveBeenCalledWith(body.email, body.password)
    expect(setAuthCookies).toHaveBeenCalledWith(expect.anything(), authResult.accessToken, authResult.refreshToken)
    expect(response).toEqual({ user: authResult.user })
  })

  it('should return 400 for invalid body', async () => {
    // Arrange
    const body = { email: 'invalid' } // Missing password
    const validationError = { statusCode: 400, statusMessage: 'Validation failed' }
    vi.mocked(readValidatedBody).mockRejectedValue(validationError)

    // Act & Assert
    await expect($fetch('/api/auth/workos/password', { method: 'POST', body })).rejects.toMatchObject(validationError)
    expect(signInWithPassword).not.toHaveBeenCalled()
    expect(setAuthCookies).not.toHaveBeenCalled()
  })

  it('should return 401 if authentication fails', async () => {
    // Arrange
    const body = { email: 'test@example.com', password: 'wrong_password' }
    const authError = new Error('Invalid credentials')
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(signInWithPassword).mockRejectedValue(authError)

    // Act & Assert
    await expect($fetch('/api/auth/workos/password', { method: 'POST', body })).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: authError.message,
    })
    expect(setAuthCookies).not.toHaveBeenCalled()
  })
})
