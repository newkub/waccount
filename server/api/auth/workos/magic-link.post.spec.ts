import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { sendMagicLink } from '../../../utils/auth'
import { readValidatedBody } from '../../../utils/api'

// Mock utilities
vi.mock('../../../utils/auth', () => ({
  sendMagicLink: vi.fn(),
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

describe('POST /api/auth/workos/magic-link', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should send a magic link for a valid email', async () => {
    // Arrange
    const email = 'test@example.com'
    const successResponse = { success: true }
    vi.mocked(readValidatedBody).mockResolvedValue({ email })
    vi.mocked(sendMagicLink).mockResolvedValue(successResponse)

    // Act
    const response = await $fetch('/api/auth/workos/magic-link', { method: 'POST', body: { email } })

    // Assert
    expect(readValidatedBody).toHaveBeenCalledOnce()
    expect(sendMagicLink).toHaveBeenCalledWith(email)
    expect(response).toEqual(successResponse)
  })

  it('should return 400 for an invalid email', async () => {
    // Arrange
    const email = 'invalid-email'
    const validationError = { statusCode: 400, statusMessage: 'Invalid email format' }
    vi.mocked(readValidatedBody).mockRejectedValue(validationError)

    // Act & Assert
    await expect($fetch('/api/auth/workos/magic-link', { method: 'POST', body: { email } })).rejects.toMatchObject(validationError)
    expect(sendMagicLink).not.toHaveBeenCalled()
  })

  it('should return 500 if sendMagicLink fails', async () => {
    // Arrange
    const email = 'test@example.com'
    const errorMessage = 'Failed to send email'
    vi.mocked(readValidatedBody).mockResolvedValue({ email })
    vi.mocked(sendMagicLink).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect($fetch('/api/auth/workos/magic-link', { method: 'POST', body: { email } })).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: errorMessage,
    })
    expect(sendMagicLink).toHaveBeenCalledWith(email)
  })
})
