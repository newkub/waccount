import { describe, it, expect, vi } from 'vitest'
import type { H3Event } from 'h3'
import membershipsEventHandler from './memberships.get'

// Mocks
const mockRequireAuthenticatedAuthkitSession = vi.fn()
vi.mock('../../../utils/authkit-guard', () => ({
  requireAuthenticatedAuthkitSession: mockRequireAuthenticatedAuthkitSession,
}))

const mockGetOrCreateOrganizationByExternalId = vi.fn()
vi.mock('../../../utils/workos-org', () => ({
  getOrCreateOrganizationByExternalId: mockGetOrCreateOrganizationByExternalId,
}))

const mockListOrganizationMemberships = vi.fn()
const mockWorkos = {
  userManagement: {
    listOrganizationMemberships: mockListOrganizationMemberships,
  },
}
vi.mock('../../../utils/authkit-session', () => ({
  getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}))

const mockOrgMembershipsResponseSchema = {
  parse: vi.fn(data => data), // Passthrough parse
}
vi.mock('#shared/types', () => ({
  OrgMembershipsResponseSchema: mockOrgMembershipsResponseSchema,
}))

describe('GET /api/orgs/[org]/memberships', () => {
  it('should throw an error if user is not authenticated', async () => {
    const unauthorizedError = new Error('Unauthorized')
    mockRequireAuthenticatedAuthkitSession.mockRejectedValue(unauthorizedError)
    const mockEvent = { context: { params: { org: 'org_123' } } } as unknown as H3Event

    await expect(membershipsEventHandler(mockEvent)).rejects.toThrow(unauthorizedError)
  })

  it('should fetch and return organization memberships', async () => {
    const orgExternalId = 'ext_123'
    const mockEvent = { context: { params: { org: orgExternalId } } } as unknown as H3Event

    mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: { id: 'user_123' } })
    const mockOrg = { id: 'org_123', externalId: orgExternalId, name: 'Test Org' }
    mockGetOrCreateOrganizationByExternalId.mockResolvedValue(mockOrg)

    const mockMemberships = {
      data: [
        { id: 'mem_1', userId: 'user_A', organizationId: 'org_123', status: 'active', role: { slug: 'member' } },
        { id: 'mem_2', userId: 'user_B', organizationId: 'org_123', status: 'invited', role: { slug: 'admin' } },
      ],
    }
    mockListOrganizationMemberships.mockResolvedValue(mockMemberships)

    const result = await membershipsEventHandler(mockEvent)

    expect(mockGetOrCreateOrganizationByExternalId).toHaveBeenCalledWith(mockWorkos, orgExternalId)
    expect(mockListOrganizationMemberships).toHaveBeenCalledWith({ organizationId: 'org_123', limit: 50 })
    expect(mockOrgMembershipsResponseSchema.parse).toHaveBeenCalled()
    expect(result.memberships.length).toBe(2)
    expect(result.memberships[0].id).toBe('mem_1')
    expect(result.organization.name).toBe('Test Org')
  })
})
