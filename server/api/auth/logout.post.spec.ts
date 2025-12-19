import { describe, it, expect, vi, afterEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils'

// Mock Nuxt composables
const mockSessionClear = vi.fn()
const mockUseSession = vi.fn(() => Promise.resolve({ clear: mockSessionClear }))

vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal().catch(() => ({}))
  return {
    ...(typeof original === 'object' && original !== null ? original : {}),
    useRuntimeConfig: vi.fn(() => ({
      nuxtSecret: 'a-very-secret-password-for-testing',
    })),
    useSession: mockUseSession,
    defineEventHandler: (handler: any) => handler,
  }
})

describe('POST /api/auth/logout', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should clear the session and return success', async () => {
    // Act
    const response = await $fetch('/api/auth/logout', { method: 'POST' })

    // Assert
    expect(mockUseSession).toHaveBeenCalled()
    expect(mockSessionClear).toHaveBeenCalledOnce()
    expect(response).toEqual({ success: true })
  })
})
