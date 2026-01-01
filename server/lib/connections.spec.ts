import { describe, expect, it, vi } from "vitest";
import { ensureUserHasOrganization } from "../utils/session";
import { createWorkos } from "../utils/workos";
import { deleteConnection, getConnections } from "./connections";

// Mock dependencies
vi.mock("../utils/workos");
vi.mock("../utils/session");

const mockEvent = {} as any; // Mock H3Event

describe("Server Lib: connections", () => {
	it("getConnections should fetch and map connections from WorkOS", async () => {
		const mockWorkos = {
			sso: {
				listConnections: vi.fn().mockResolvedValue({
					data: [
						{
							id: "conn_123",
							connectionType: "GoogleOAuth",
							state: "active",
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						},
					],
				}),
			},
		};
		(createWorkos as vi.Mock).mockReturnValue(mockWorkos);
		(ensureUserHasOrganization as vi.Mock).mockResolvedValue("org_123");

		const connections = await getConnections(mockEvent);

		expect(ensureUserHasOrganization).toHaveBeenCalledWith(mockEvent);
		expect(mockWorkos.sso.listConnections).toHaveBeenCalledWith({ organizationId: "org_123" });
		expect(connections).toHaveLength(1);
		expect(connections[0].provider).toBe("GoogleOAuth");
	});

	it("deleteConnection should call WorkOS deleteConnection", async () => {
		const mockWorkos = {
			sso: {
				deleteConnection: vi.fn().mockResolvedValue({ success: true }),
			},
		};
		(createWorkos as vi.Mock).mockReturnValue(mockWorkos);

		const result = await deleteConnection(mockEvent, "conn_123");

		expect(mockWorkos.sso.deleteConnection).toHaveBeenCalledWith("conn_123");
		expect(result.success).toBe(true);
	});
});
