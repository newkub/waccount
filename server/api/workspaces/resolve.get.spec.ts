import { describe, it, expect, vi } from 'vitest'
import { H3Event, getQuery } from 'h3'
import resolveEventHandler from './resolve.get'

// Mocks
const mockUser = { id: 'user_123', email: 'test@example.com' }
const mockRequireAuthenticatedAuthkitSession = vi.fn()
vi.mock('../../utils/authkit-guard', () => ({
  requireAuthenticatedAuthkitSession: mockRequireAuthenticatedAuthkitSession,
}))

const mockGetOrCreateOrganizationByExternalId = vi.fn()
vi.mock('../../utils/workos-org', () => ({
  getOrCreateOrganizationByExternalId: mockGetOrCreateOrganizationByExternalId,
}))

const mockMapWorkosUserToAppUser = vi.fn(user => ({ ...user, mapped: true }))
vi.mock('../../utils/workos-user', () => ({
  mapWorkosUserToAppUser: mockMapWorkosUserToAppUser,
}))

const mockListOrganizationMemberships = vi.fn()
const mockGetUser = vi.fn()
const mockWorkos = {
  userManagement: {
    listOrganizationMemberships: mockListOrganizationMemberships,
    getUser: mockGetUser,
  },
}
vi.mock('../../utils/authkit-session', () => ({
  getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}))

vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    getQuery: vi.fn(),
  }
})

describe('GET /api/workspaces/resolve', () => {
  const mockEvent = {} as H3Event

  it('should throw an error if user is not authenticated', async () => {
    const unauthorizedError = new Error('Unauthorized')
    mockRequireAuthenticatedAuthkitSession.mockRejectedValue(unauthorizedError)
    await expect(resolveEventHandler(mockEvent)).rejects.toThrow(unauthorizedError)
  })

  it('should resolve a personal workspace', async () => {
    mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: mockUser })
    vi.mocked(getQuery).mockReturnValue({ project: 'personal-project' })

    const result = await resolveEventHandler(mockEvent)

    expect(result.workspace.id).toBe('personal-project')
    expect(result.organization).toBeNull()
    expect(result.members.length).toBe(1)
    expect(result.members[0].mapped).toBe(true)
    expect(mockGetOrCreateOrganizationByExternalId).not.toHaveBeenCalled()
  })

  it('should resolve an organization workspace', async () => {
    mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: mockUser })
    const orgExternalId = 'ext_123'
    vi.mocked(getQuery).mockReturnValue({ org: orgExternalId })

    const mockOrg = { id: 'org_123', externalId: orgExternalId, name: 'Test Org', domains: [] }
    mockGetOrCreateOrganizationByExternalId.mockResolvedValue(mockOrg)

    const mockMemberships = { data: [{ userId: 'org_user_1' }] }
    mockListOrganizationMemberships.mockResolvedValue(mockMemberships)
    const mockOrgUser = { id: 'org_user_1' }
    mockGetUser.mockResolvedValue(mockOrgUser)

    const result = await resolveEventHandler(mockEvent)

    expect(result.workspace.id).toBe('ext_123/')
    expect(result.organization.id).toBe('org_123')
    expect(result.members.length).toBe(1)
    expect(result.members[0].id).toBe('org_user_1')
    expect(mockGetOrCreateOrganizationByExternalId).toHaveBeenCalledWith(mockWorkos, orgExternalId)
  })
})
