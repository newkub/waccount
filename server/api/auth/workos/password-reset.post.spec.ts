import { describe, it, expect, vi } from 'vitest'
import { H3Event, createError } from 'h3'
import passwordResetEventHandler from './password-reset.post'

// Mocks
const mockSendPasswordResetEmail = vi.fn()
const mockWorkos = {
  userManagement: {
    sendPasswordResetEmail: mockSendPasswordResetEmail,
  },
}
vi.mock('../../../utils/authkit-session', () => ({
  getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}))

const mockUseRuntimeConfig = vi.fn()
vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: mockUseRuntimeConfig,
}))

const mockReadBody = vi.fn()
vi.stubGlobal('readBody', mockReadBody)

describe('POST /api/auth/workos/password-reset', () => {
  const mockEvent = {} as H3Event

  it('should throw 400 if email is missing', async () => {
    mockReadBody.mockResolvedValue({})
    await expect(passwordResetEventHandler(mockEvent)).rejects.toThrow(
      createError({ statusCode: 400, statusMessage: 'Missing email' }),
    )
  })

  it('should throw 500 if baseUrl is missing', async () => {
    mockReadBody.mockResolvedValue({ email: 'test@example.com' })
    mockUseRuntimeConfig.mockReturnValue({ public: {} })
    await expect(passwordResetEventHandler(mockEvent)).rejects.toThrow(
      createError({ statusCode: 500, statusMessage: 'Missing NUXT_PUBLIC_BASE_URL' }),
    )
  })

  it('should call sendPasswordResetEmail and return success', async () => {
    const baseUrl = 'http://localhost:3000'
    const email = 'test@example.com'

    mockReadBody.mockResolvedValue({ email })
    mockUseRuntimeConfig.mockReturnValue({ public: { baseUrl } })
    mockSendPasswordResetEmail.mockResolvedValue(undefined)

    const result = await passwordResetEventHandler(mockEvent)

    expect(result).toEqual({ success: true })
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
      email,
      passwordResetUrl: `${baseUrl}/auth/reset-password`,
    })
  })
})
