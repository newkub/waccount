import type { H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import membersEventHandler from "./members.get";

// Mocks
const mockRequireAuthenticatedAuthkitSession = vi.fn();
vi.mock("../../../utils/authkit-guard", () => ({
	requireAuthenticatedAuthkitSession: mockRequireAuthenticatedAuthkitSession,
}));

const mockGetOrCreateOrganizationByExternalId = vi.fn();
vi.mock("../../../utils/workos-org", () => ({
	getOrCreateOrganizationByExternalId: mockGetOrCreateOrganizationByExternalId,
}));

const mockMapWorkosUserToAppUser = vi.fn(user => ({ ...user, mapped: true }));
vi.mock("../../../utils/workos-user", () => ({
	mapWorkosUserToAppUser: mockMapWorkosUserToAppUser,
}));

const mockListOrganizationMemberships = vi.fn();
const mockGetUser = vi.fn();
const mockWorkos = {
	userManagement: {
		listOrganizationMemberships: mockListOrganizationMemberships,
		getUser: mockGetUser,
	},
};
vi.mock("../../../utils/authkit-session", () => ({
	getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}));

const mockOrgMembersResponseSchema = {
	parse: vi.fn(data => data), // Passthrough parse
};
vi.mock("#shared/types", () => ({
	OrgMembersResponseSchema: mockOrgMembersResponseSchema,
}));

describe("GET /api/orgs/[org]/members", () => {
	it("should throw an error if user is not authenticated", async () => {
		const unauthorizedError = new Error("Unauthorized");
		mockRequireAuthenticatedAuthkitSession.mockRejectedValue(unauthorizedError);
		const mockEvent = { context: { params: { org: "org_123" } } } as unknown as H3Event;

		await expect(membersEventHandler(mockEvent)).rejects.toThrow(unauthorizedError);
	});

	it("should fetch and return organization members", async () => {
		const orgExternalId = "ext_123";
		const mockEvent = { context: { params: { org: orgExternalId } } } as unknown as H3Event;

		mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: { id: "user_123" } });
		const mockOrg = { id: "org_123", externalId: orgExternalId, name: "Test Org" };
		mockGetOrCreateOrganizationByExternalId.mockResolvedValue(mockOrg);

		const mockMemberships = {
			data: [{ userId: "user_A" }, { userId: "user_B" }],
		};
		mockListOrganizationMemberships.mockResolvedValue(mockMemberships);

		const mockUserA = { id: "user_A", email: "a@example.com" };
		const mockUserB = { id: "user_B", email: "b@example.com" };
		mockGetUser.mockImplementation(async (userId: string) => {
			if (userId === "user_A") return mockUserA;
			if (userId === "user_B") return mockUserB;
			throw new Error("User not found");
		});

		const result = await membersEventHandler(mockEvent);

		expect(mockGetOrCreateOrganizationByExternalId).toHaveBeenCalledWith(mockWorkos, orgExternalId);
		expect(mockListOrganizationMemberships).toHaveBeenCalledWith({ organizationId: "org_123", limit: 50 });
		expect(mockGetUser).toHaveBeenCalledTimes(2);
		expect(mockMapWorkosUserToAppUser).toHaveBeenCalledWith(mockUserA);
		expect(mockMapWorkosUserToAppUser).toHaveBeenCalledWith(mockUserB);
		expect(mockOrgMembersResponseSchema.parse).toHaveBeenCalled();
		expect(result.members.length).toBe(2);
		expect(result.members[0].mapped).toBe(true);
	});
});
