import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { getAuthorizationUrl } from '../../../../utils/auth'

// Mock the utility function
vi.mock('../../../../utils/auth', () => ({
  getAuthorizationUrl: vi.fn(),
}))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    getRouterParam: (event: any, param: string) => {
      // Simple mock for router params based on URL
      const parts = event.node.req.url.split('/')
      // e.g., /api/auth/workos/authorize/google -> parts[5] is 'google'
      if (param === 'provider') {
        return parts[5]
      }
    },
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('GET /api/auth/workos/authorize/[provider]', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return authorization URL for a valid provider', async () => {
    // Arrange
    const fakeUrl = 'https://auth.example.com/google'
    const provider = 'google';
    (getAuthorizationUrl as ReturnType<typeof vi.fn>).mockReturnValue({ authorizationUrl: fakeUrl })

    // Act
    const result = await $fetch(`/api/auth/workos/authorize/${provider}`)

    // Assert
    expect(getAuthorizationUrl).toHaveBeenCalledWith(provider)
    expect(result).toEqual({ authorizationUrl: fakeUrl })
  })

  it('should throw 500 if getAuthorizationUrl fails', async () => {
    // Arrange
    const provider = 'invalid-provider'
    const errorMessage = 'Invalid provider specified';
    (getAuthorizationUrl as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error(errorMessage)
    })

    // Act & Assert
    await expect($fetch(`/api/auth/workos/authorize/${provider}`)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: errorMessage,
    })
    expect(getAuthorizationUrl).toHaveBeenCalledWith(provider)
  })
})
