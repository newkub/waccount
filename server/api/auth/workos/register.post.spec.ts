import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'
import { signUpWithPassword } from '../../../utils/auth'
import { readValidatedBody } from '../../../utils/api'

// Mock utilities
vi.mock('../../../utils/auth', () => ({
  signUpWithPassword: vi.fn(),
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

describe('POST /api/auth/workos/register', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user and return user and message', async () => {
    // Arrange
    const body = { 
      email: 'newuser@example.com', 
      password: 'password123', 
      firstName: 'New', 
      lastName: 'User' 
    }
    const signUpResult = {
      user: { id: 'user_new', email: body.email },
      message: 'Registration successful',
    }
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(signUpWithPassword).mockResolvedValue(signUpResult)

    // Act
    const response = await $fetch('/api/auth/workos/register', { method: 'POST', body })

    // Assert
    expect(readValidatedBody).toHaveBeenCalledOnce()
    expect(signUpWithPassword).toHaveBeenCalledWith(body.email, body.password, { firstName: body.firstName, lastName: body.lastName })
    expect(response).toEqual(signUpResult)
  })

  it('should return 400 for invalid body', async () => {
    // Arrange
    const body = { email: 'invalid' } // Missing fields
    const validationError = { statusCode: 400, statusMessage: 'Validation failed' }
    vi.mocked(readValidatedBody).mockRejectedValue(validationError)

    // Act & Assert
    await expect($fetch('/api/auth/workos/register', { method: 'POST', body })).rejects.toMatchObject(validationError)
    expect(signUpWithPassword).not.toHaveBeenCalled()
  })

  it('should return 500 if registration fails', async () => {
    // Arrange
    const body = { 
      email: 'existing@example.com', 
      password: 'password123', 
      firstName: 'Existing', 
      lastName: 'User' 
    }
    const errorMessage = 'Email already exists'
    vi.mocked(readValidatedBody).mockResolvedValue(body)
    vi.mocked(signUpWithPassword).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect($fetch('/api/auth/workos/register', { method: 'POST', body })).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  })
})
