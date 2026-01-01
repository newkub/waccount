import { describe, it, expect, vi } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
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

describe('GET /api/auth/callback', () => {
  const app = createApp()
  app.use('/api/auth/callback', eventHandler(callbackEventHandler))
  const request = supertest(toNodeListener(app))

  it('should throw 400 if code is missing', async () => {
    const response = await request.get('/api/auth/callback')
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Missing authorization code')
  })

  it('should create a new user and redirect', async () => {
    const mockWorkosUser = { id: 'workos-user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User', profilePictureUrl: 'url' }
    const mockDbUser = { id: 'workos-user-1', email: 'test@example.com', name: 'Test User', avatarUrl: 'url' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)
    vi.mocked(db.returning).mockResolvedValue([mockDbUser])
    mockLucia.createSession.mockResolvedValue({ id: 'session-1' })

    const response = await request.get('/api/auth/callback?code=test-code')

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/me')
    expect(response.headers['set-cookie']).toContain('mock-cookie')
    expect(db.insert).toHaveBeenCalled()
  })

  it('should use existing user and redirect', async () => {
    const mockWorkosUser = { id: 'workos-user-2', email: 'existing@example.com' }
    const mockDbUser = { id: 'workos-user-2', email: 'existing@example.com' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(mockDbUser)
    mockLucia.createSession.mockResolvedValue({ id: 'session-2' })

    const response = await request.get('/api/auth/callback?code=another-code')

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/me')
    expect(response.headers['set-cookie']).toContain('mock-cookie')
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('should throw 500 if user creation fails', async () => {
    const mockWorkosUser = { id: 'workos-user-3', email: 'fail@example.com' }

    mockWorkos.userManagement.authenticateWithCode.mockResolvedValue({ user: mockWorkosUser })
    const { db } = await import('~~/server/db')
    vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)
    vi.mocked(db.returning).mockResolvedValue([]) // Simulate failed insert

    const response = await request.get('/api/auth/callback?code=fail-code')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to create user')
  })
})
