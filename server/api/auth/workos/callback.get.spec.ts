import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { getWorkOS, getWorkOSClientId } from '../../../integrations/workos'
import { setAuthCookies } from '../../../utils/auth'
import { callWorkOS } from '../../../utils/api'

// Mock utilities
vi.mock('../../../integrations/workos', () => ({
  getWorkOS: vi.fn(),
  getWorkOSClientId: vi.fn(),
}))
vi.mock('../../../utils/auth', () => ({
  setAuthCookies: vi.fn(),
}))
vi.mock('../../../utils/api', () => ({
  callWorkOS: vi.fn(),
}))

const mockSendRedirect = vi.fn((_event, location) => ({ redirectedTo: location }))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    getQuery: (event: any) => {
      const url = new URL(event.node.req.url, 'http://localhost')
      const params: { [key: string]: string } = {}
      url.searchParams.forEach((value, key) => { params[key] = value })
      return params
    },
    sendRedirect: mockSendRedirect,
  }
})

describe('GET /api/auth/workos/callback', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should authenticate, set cookies, and redirect on success', async () => {
    // Arrange
    const code = 'valid_code'
    const mockResult = {
      accessToken: 'access_token_123',
      refreshToken: 'refresh_token_456',
      user: { id: 'user_789' },
    }
    vi.mocked(callWorkOS).mockResolvedValue(mockResult)

    // Act
    const result = await $fetch(`/api/auth/workos/callback?code=${code}`) as { redirectedTo: string }

    // Assert
    expect(callWorkOS).toHaveBeenCalledOnce()
    expect(setAuthCookies).toHaveBeenCalledWith(expect.anything(), mockResult.accessToken, mockResult.refreshToken)
    expect(mockSendRedirect).toHaveBeenCalledWith(expect.anything(), `/${mockResult.user.id}/profile`)
    expect(result.redirectedTo).toBe(`/${mockResult.user.id}/profile`)
  })

  it('should redirect to login with error if code is missing', async () => {
    // Act
    const result = await $fetch('/api/auth/workos/callback') as { redirectedTo: string }

    // Assert
    expect(callWorkOS).not.toHaveBeenCalled()
    expect(setAuthCookies).not.toHaveBeenCalled()
    expect(mockSendRedirect).toHaveBeenCalledWith(expect.anything(), '/auth/login?error=invalid_code')
    expect(result.redirectedTo).toBe('/auth/login?error=invalid_code')
  })

  it('should redirect to login with error if authentication fails', async () => {
    // Arrange
    const code = 'invalid_code'
    const errorMessage = 'Authentication failed'
    vi.mocked(callWorkOS).mockRejectedValue(new Error(errorMessage))

    // Act
    const result = await $fetch(`/api/auth/workos/callback?code=${code}`) as { redirectedTo: string }

    // Assert
    expect(callWorkOS).toHaveBeenCalledOnce()
    expect(setAuthCookies).not.toHaveBeenCalled()
    expect(mockSendRedirect).toHaveBeenCalledWith(expect.anything(), `/auth/login?error=${encodeURIComponent(errorMessage)}`)
    expect(result.redirectedTo).toBe(`/auth/login?error=${encodeURIComponent(errorMessage)}`)
  })
})
