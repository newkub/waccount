import type { H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import orgEventHandler from "./[org].get";

// Mocks
const mockRequireAuthenticatedAuthkitSession = vi.fn();
vi.mock("../../utils/authkit-guard", () => ({
	requireAuthenticatedAuthkitSession: mockRequireAuthenticatedAuthkitSession,
}));

const mockGetOrCreateOrganizationByExternalId = vi.fn();
vi.mock("../../utils/workos-org", () => ({
	getOrCreateOrganizationByExternalId: mockGetOrCreateOrganizationByExternalId,
}));

const mockWorkos = { userManagement: {} }; // Mock workos object
vi.mock("../../utils/authkit-session", () => ({
	getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}));

const mockOrganizationSchema = {
	parse: vi.fn(data => data), // Passthrough parse
};
vi.mock("../../../shared/types", () => ({
	OrganizationSchema: mockOrganizationSchema,
}));

describe("GET /api/orgs/[org]", () => {
	it("should throw an error if user is not authenticated", async () => {
		const unauthorizedError = new Error("Unauthorized");
		mockRequireAuthenticatedAuthkitSession.mockRejectedValue(unauthorizedError);
		const mockEvent = { context: { params: { org: "org_123" } } } as unknown as H3Event;

		await expect(orgEventHandler(mockEvent)).rejects.toThrow(unauthorizedError);
	});

	it("should return the organization data on success", async () => {
		const orgExternalId = "ext_123";
		const mockEvent = { context: { params: { org: orgExternalId } } } as unknown as H3Event;
		mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: { id: "user_123" } });
		const mockOrg = {
			id: "org_123",
			externalId: orgExternalId,
			name: "Test Org",
			domains: [{ domain: "example.com" }],
			metadata: { some: "data" },
		};
		mockGetOrCreateOrganizationByExternalId.mockResolvedValue(mockOrg);

		const result = await orgEventHandler(mockEvent);

		expect(mockGetOrCreateOrganizationByExternalId).toHaveBeenCalledWith(mockWorkos, orgExternalId);
		expect(mockOrganizationSchema.parse).toHaveBeenCalledWith({
			id: "org_123",
			externalId: orgExternalId,
			name: "Test Org",
			domains: ["example.com"],
			metadata: { some: "data" },
		});
		expect(result.organization.id).toBe("org_123");
	});
});
