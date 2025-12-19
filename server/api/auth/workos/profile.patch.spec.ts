import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { updateUserProfile } from '../../../utils/user'
import { readValidatedBody } from '../../../utils/api'

// Mock utilities
vi.mock('../../../utils/user', () => ({
  updateUserProfile: vi.fn(),
}))
vi.mock('../../../utils/api', () => ({
  readValidatedBody: vi.fn(),
}))

const mockGetCookie = vi.fn()

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    getCookie: mockGetCookie,
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('PATCH /api/auth/workos/profile', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should update profile and return it on success', async () => {
    // Arrange
    const userId = 'user_123'
    const body = { firstName: 'John', lastName: 'Doe' }
    const updatedProfile = { id: userId, ...body }
    mockGetCookie.mockReturnValue(userId)
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(updateUserProfile).mockResolvedValue(updatedProfile)

    // Act
    const response = await $fetch('/api/auth/workos/profile', { method: 'PATCH', body })

    // Assert
    expect(mockGetCookie).toHaveBeenCalledWith(expect.anything(), 'user_id')
    expect(readValidatedBody).toHaveBeenCalledOnce()
    expect(updateUserProfile).toHaveBeenCalledWith(userId, body)
    expect(response).toEqual({ profile: updatedProfile })
  })

  it('should return 401 if not authenticated', async () => {
    // Arrange
    mockGetCookie.mockReturnValue(undefined)

    // Act & Assert
    await expect($fetch('/api/auth/workos/profile', { method: 'PATCH', body: {} })).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
    expect(updateUserProfile).not.toHaveBeenCalled()
  })

  it('should return 400 for invalid body', async () => {
    // Arrange
    const userId = 'user_123'
    const validationError = { statusCode: 400, statusMessage: 'Validation failed' }
    mockGetCookie.mockReturnValue(userId)
    vi.mocked(readValidatedBody).mockRejectedValue(validationError)

    // Act & Assert
    await expect($fetch('/api/auth/workos/profile', { method: 'PATCH', body: {} })).rejects.toMatchObject(validationError)
    expect(updateUserProfile).not.toHaveBeenCalled()
  })

  it('should return 500 if updateUserProfile fails', async () => {
    // Arrange
    const userId = 'user_123'
    const body = { firstName: 'John' }
    const errorMessage = 'Database error'
    mockGetCookie.mockReturnValue(userId)
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(updateUserProfile).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect($fetch('/api/auth/workos/profile', { method: 'PATCH', body })).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  })
})
