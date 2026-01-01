import { describe, it, expect, vi } from 'vitest'
import type { H3Event } from 'h3'
import loginEventHandler from './login.get'

// Mocks
const mockAuthorizationUrl = 'https://mock.workos.com/auth'
const mockWorkos = {
  userManagement: {
    getAuthorizationUrl: vi.fn(() => mockAuthorizationUrl),
  },
}
vi.stubGlobal('createWorkos', vi.fn(() => mockWorkos))

const mockConfig = {
  workosRedirectUri: 'http://localhost/auth/callback',
  workosClientId: 'mock-client-id',
}
vi.stubGlobal('useRuntimeConfig', vi.fn(() => mockConfig))

const mockSendRedirect = vi.fn()
vi.stubGlobal('sendRedirect', mockSendRedirect)

describe('GET /api/auth/login', () => {
  it('should redirect to WorkOS authorization URL', async () => {
    const mockEvent = {} as H3Event
    await loginEventHandler(mockEvent)

    // Check if WorkOS functions were called correctly
    expect(createWorkos).toHaveBeenCalled()
    expect(useRuntimeConfig).toHaveBeenCalled()
    expect(mockWorkos.userManagement.getAuthorizationUrl).toHaveBeenCalledWith({
      provider: 'authkit',
      redirectUri: mockConfig.workosRedirectUri,
      clientId: mockConfig.workosClientId,
    })

    // Check if sendRedirect was called with the correct URL
    expect(mockSendRedirect).toHaveBeenCalledWith(mockEvent, mockAuthorizationUrl)
  })
})
