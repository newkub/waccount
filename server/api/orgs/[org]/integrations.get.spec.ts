import type { H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import integrationsEventHandler from "./integrations.get";

// Mocks
const mockRequireAuthenticatedAuthkitSession = vi.fn();
vi.mock("../../../utils/authkit-guard", () => ({
	requireAuthenticatedAuthkitSession: mockRequireAuthenticatedAuthkitSession,
}));

const mockGetOrCreateOrganizationByExternalId = vi.fn();
vi.mock("../../../utils/workos-org", () => ({
	getOrCreateOrganizationByExternalId: mockGetOrCreateOrganizationByExternalId,
}));

const mockSsoListConnections = vi.fn();
const mockDirectorySyncListDirectories = vi.fn();
const mockPortalGenerateLink = vi.fn();
const mockWorkos = {
	sso: { listConnections: mockSsoListConnections },
	directorySync: { listDirectories: mockDirectorySyncListDirectories },
	portal: { generateLink: mockPortalGenerateLink },
};
vi.mock("../../../utils/authkit-session", () => ({
	getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}));

const mockOrgIntegrationsResponseSchema = {
	parse: vi.fn(data => data), // Passthrough parse
};
vi.mock("#shared/types", () => ({
	OrgIntegrationsResponseSchema: mockOrgIntegrationsResponseSchema,
}));

vi.mock("nitropack/runtime", () => ({
	useRuntimeConfig: () => ({ public: { baseUrl: "http://localhost:3000" } }),
}));

describe("GET /api/orgs/[org]/integrations", () => {
	it("should throw an error if user is not authenticated", async () => {
		const unauthorizedError = new Error("Unauthorized");
		mockRequireAuthenticatedAuthkitSession.mockRejectedValue(unauthorizedError);
		const mockEvent = { context: { params: { org: "org_123" } } } as unknown as H3Event;

		await expect(integrationsEventHandler(mockEvent)).rejects.toThrow(unauthorizedError);
	});

	it("should fetch and return integrations data", async () => {
		const orgExternalId = "ext_123";
		const mockEvent = { context: { params: { org: orgExternalId } } } as unknown as H3Event;

		mockRequireAuthenticatedAuthkitSession.mockResolvedValue({ user: { id: "user_123" } });
		const mockOrg = { id: "org_123", externalId: orgExternalId, name: "Test Org" };
		mockGetOrCreateOrganizationByExternalId.mockResolvedValue(mockOrg);

		mockSsoListConnections.mockResolvedValue({ data: [] });
		mockDirectorySyncListDirectories.mockResolvedValue({ data: [] });
		mockPortalGenerateLink
			.mockResolvedValueOnce({ link: "sso-link" })
			.mockResolvedValueOnce({ link: "dsync-link" })
			.mockResolvedValueOnce({ link: "audit-logs-link" });

		const result = await integrationsEventHandler(mockEvent);

		expect(mockGetOrCreateOrganizationByExternalId).toHaveBeenCalledWith(mockWorkos, orgExternalId);
		expect(mockSsoListConnections).toHaveBeenCalledWith({ organizationId: "org_123", limit: 50 });
		expect(mockDirectorySyncListDirectories).toHaveBeenCalledWith({ organizationId: "org_123", limit: 50 });
		expect(mockPortalGenerateLink).toHaveBeenCalledTimes(3);
		expect(mockOrgIntegrationsResponseSchema.parse).toHaveBeenCalled();
		expect(result.portals.sso).toBe("sso-link");
	});
});
