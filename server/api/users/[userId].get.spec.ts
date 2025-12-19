import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { getUserById } from '../../utils/auth'

// Mock utilities
vi.mock('../../utils/auth', () => ({
  getUserById: vi.fn(),
}))

// Mock Nuxt composables
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    defineEventHandler: (handler: any) => handler,
    getRouterParam: (event: any, param: string) => {
      const parts = event.node.req.url.split('/')
      if (param === 'userId') {
        return parts[3]
      }
    },
    createError: vi.fn((err) => { throw { ...err, __isError: true } }),
  }
})

describe('GET /api/users/[userId]', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return user for a valid userId', async () => {
    // Arrange
    const userId = 'user_123'
    const mockUser = { id: userId, email: 'test@example.com' }
    vi.mocked(getUserById).mockResolvedValue(mockUser)

    // Act
    const result = await $fetch(`/api/users/${userId}`)

    // Assert
    expect(getUserById).toHaveBeenCalledWith(userId)
    expect(result).toEqual({ user: mockUser })
  })

  it('should return 404 if user is not found', async () => {
    // Arrange
    const userId = 'non_existent_user'
    const errorMessage = 'User not found'
    vi.mocked(getUserById).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect($fetch(`/api/users/${userId}`)).rejects.toMatchObject({
      statusCode: 404,
      // The handler uses `error.message` which is what we check here
      message: errorMessage,
    })
    expect(getUserById).toHaveBeenCalledWith(userId)
  })
})
