import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'

// Mock external dependencies
const mockUser = { id: 'user_123', email: 'test@example.com' }
const mockAuthenticateWithCode = vi.fn()
vi.mock('@workos-inc/node', () => ({
  WorkOS: vi.fn(() => ({
    userManagement: {
      authenticateWithCode: mockAuthenticateWithCode,
    },
  })),
}))

const mockSessionUpdate = vi.fn()
const mockUseSession = vi.fn(() => Promise.resolve({ update: mockSessionUpdate }))
const mockSendRedirect = vi.fn((_event, location) => ({ redirectedTo: location }))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))

  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    useRuntimeConfig: vi.fn(() => ({
      workosApiKey: 'sk_test_123',
      workosClientId: 'client_123',
      nuxtSecret: 'a-very-secret-password-for-testing',
    })),
    useSession: mockUseSession,
    sendRedirect: mockSendRedirect,
    defineEventHandler: (handler: any) => handler,
    getQuery: (event: any) => {
        const url = new URL(event.node.req.url, 'http://localhost')
        const params: { [key: string]: string } = {}
        url.searchParams.forEach((value, key) => {
            params[key] = value
        })
        return params
    },
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('GET /api/auth/callback', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle successful authentication and redirect', async () => {
    // Arrange
    const code = 'auth_code_123'
    mockAuthenticateWithCode.mockResolvedValue({ user: mockUser })

    // Act
    const result = await $fetch(`/api/auth/callback?code=${code}`) as { redirectedTo: string }

    // Assert
    expect(mockAuthenticateWithCode).toHaveBeenCalledWith({
      code,
      clientId: 'client_123',
    })
    expect(mockUseSession).toHaveBeenCalled()
    expect(mockSessionUpdate).toHaveBeenCalledWith({ user: mockUser })
    expect(mockSendRedirect).toHaveBeenCalledWith(expect.anything(), '/')
    expect(result.redirectedTo).toBe('/')
  })

  it('should throw 400 if authorization code is missing', async () => {
    // Act & Assert
    await expect($fetch('/api/auth/callback')).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Missing authorization code',
    })

    expect(mockAuthenticateWithCode).not.toHaveBeenCalled()
    expect(mockSessionUpdate).not.toHaveBeenCalled()
  })

  it('should throw 500 if WorkOS authentication fails', async () => {
    // Arrange
    const code = 'auth_code_invalid'
    mockAuthenticateWithCode.mockRejectedValue(new Error('WorkOS API Error'))

    // Act & Assert
    await expect($fetch(`/api/auth/callback?code=${code}`)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Authentication failed',
    })

    expect(mockAuthenticateWithCode).toHaveBeenCalledWith({
      code,
      clientId: 'client_123',
    })
    expect(mockSessionUpdate).not.toHaveBeenCalled()
  })
})
