import { describe, it, expect, vi } from 'vitest'
import { H3Event, createError, getQuery, sendRedirect, appendHeader } from 'h3'
import callbackEventHandler from './callback.get'

// Mock dependencies
vi.mock('~~/server/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}))

const mockLucia = {
  createSession: vi.fn(),
  createSessionCookie: vi.fn(() => ({ serialize: vi.fn(() => 'mock-cookie') })),
}
vi.stubGlobal('lucia', mockLucia)

const mockWorkos = {
  userManagement: {
    authenticateWithCode: vi.fn(),
  },
}
vi.stubGlobal('createWorkos', vi.fn(() => mockWorkos))
vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({ workosClientId: 'mock-client-id' })))
vi.stubGlobal('getQuery', vi.fn())
vi.stubGlobal('sendRedirect', vi.fn())
vi.stubGlobal('appendHeader', vi.fn())

describe('GET /api/auth/callback', () => {
  
    it('should throw 400 if code is missing', async () => {
    vi.mocked(getQuery).mockReturnValue({})
    const mockEvent = {} as H3Event

    await expect(callbackEventHandler(mockEvent)).rejects.toThrow(
      createError({
        statusCode: 400,
        statusMessage: 'Missing authorization code',
      }),
    )
  })

  it('should create a new user and redirect', async () => {
    const mockWorkosUser = { id: 'workos-user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User', profilePictureUrl: 'url' }
    const mockDbUser = { id: 'workos-user-1', email: 'test@example.com', name: 'Test User', avatarUrl: 'url' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)
    vi.mocked(db.returning).mockResolvedValue([mockDbUser])
    mockLucia.createSession.mockResolvedValue({ id: 'session-1' })

        vi.mocked(getQuery).mockReturnValue({ code: 'test-code' })
    const mockEvent = {} as H3Event

    await callbackEventHandler(mockEvent)

    expect(sendRedirect).toHaveBeenCalledWith(mockEvent, '/me')
    expect(appendHeader).toHaveBeenCalledWith(mockEvent, 'Set-Cookie', 'mock-cookie')
    expect(db.insert).toHaveBeenCalled()
  })

  it('should use existing user and redirect', async () => {
    const mockWorkosUser = { id: 'workos-user-2', email: 'existing@example.com' }
    const mockDbUser = { id: 'workos-user-2', email: 'existing@example.com' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(mockDbUser)
    mockLucia.createSession.mockResolvedValue({ id: 'session-2' })

        vi.mocked(getQuery).mockReturnValue({ code: 'another-code' })
    const mockEvent = {} as H3Event

    await callbackEventHandler(mockEvent)

    expect(sendRedirect).toHaveBeenCalledWith(mockEvent, '/me')
    expect(appendHeader).toHaveBeenCalledWith(mockEvent, 'Set-Cookie', 'mock-cookie')
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('should throw 500 if user creation fails', async () => {
    const mockWorkosUser = { id: 'workos-user-3', email: 'fail@example.com' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)
    vi.mocked(db.returning).mockResolvedValue([]) // Simulate failed insert

        vi.mocked(getQuery).mockReturnValue({ code: 'fail-code' })
    const mockEvent = {} as H3Event

    await expect(callbackEventHandler(mockEvent)).rejects.toThrow(
      createError({
        statusCode: 500,
        statusMessage: 'Failed to create user',
      }),
    )
  })
})
