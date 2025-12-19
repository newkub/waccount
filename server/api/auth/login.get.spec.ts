import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'

// Mock external dependencies
const mockGetAuthorizationUrl = vi.fn()
vi.mock('@workos-inc/node', () => ({
  WorkOS: vi.fn(() => ({
    userManagement: {
      getAuthorizationUrl: mockGetAuthorizationUrl,
    },
  })),
}))

const mockSendRedirect = vi.fn((_event, location) => ({ redirectedTo: location }))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    useRuntimeConfig: vi.fn(() => ({
      workosApiKey: 'sk_test_123',
      workosClientId: 'client_123',
      workosRedirectUri: 'http://localhost:3000/auth/callback',
    })),
    sendRedirect: mockSendRedirect,
    defineEventHandler: (handler: any) => handler,
  }
})

describe('GET /api/auth/login', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to WorkOS authorization URL', async () => {
    // Arrange
    const fakeAuthUrl = 'https://api.workos.com/auth?client_id=...'
    mockGetAuthorizationUrl.mockReturnValue(fakeAuthUrl)

    // Act
    const result = await $fetch('/api/auth/login', { method: 'GET' }) as { redirectedTo: string }

    // Assert
    expect(mockGetAuthorizationUrl).toHaveBeenCalledWith({
      provider: 'authkit',
      redirectUri: 'http://localhost:3000/auth/callback',
      clientId: 'client_123',
    })
    expect(mockSendRedirect).toHaveBeenCalledWith(expect.anything(), fakeAuthUrl)
    expect(result.redirectedTo).toBe(fakeAuthUrl)
  })
})
