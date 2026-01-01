import { describe, it, expect, vi } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
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

// Mock sendRedirect as it's not easily testable with supertest for 302
const mockSendRedirect = vi.fn()
vi.stubGlobal('sendRedirect', mockSendRedirect)

describe('GET /api/auth/login', () => {
  const app = createApp()
  app.use('/api/auth/login', eventHandler(loginEventHandler))
  const request = supertest(toNodeListener(app))

  it('should redirect to WorkOS authorization URL', async () => {
    const response = await request.get('/api/auth/login')

    // Check if WorkOS functions were called correctly
    expect(createWorkos).toHaveBeenCalled()
    expect(useRuntimeConfig).toHaveBeenCalled()
    expect(mockWorkos.userManagement.getAuthorizationUrl).toHaveBeenCalledWith({
      provider: 'authkit',
      redirectUri: mockConfig.workosRedirectUri,
      clientId: mockConfig.workosClientId,
    })

    // Check if sendRedirect was called with the correct URL
    expect(mockSendRedirect).toHaveBeenCalled()
    const redirectCall = mockSendRedirect.mock.calls[0]
    const redirectUrl = redirectCall[1]
    expect(redirectUrl).toBe(mockAuthorizationUrl)

    // Supertest might not see the 302 because we mocked sendRedirect,
    // but we can check the intent. A successful call without error implies success.
    expect(response.status).toBe(200) // or whatever the default is when redirect is mocked
  })
})
