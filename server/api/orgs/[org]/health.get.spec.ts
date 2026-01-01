import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/orgs/[org]/health.get", () => {
	it("returns health summary", async () => {

		const user = createMockWorkosUser({ id: "user_1" });
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce({
			authenticate: vi.fn().mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		});

		mockWorkos.organizations.getOrganizationByExternalId.mockResolvedValueOnce({
			id: "org_1",
			externalId: "acme",
			name: "acme",
		});

		mockWorkos.sso.listConnections.mockResolvedValueOnce({
			data: [
				{ id: "conn_1", state: "active" },
				{ id: "conn_2", state: "inactive" },
			],
		});
		mockWorkos.directorySync.listDirectories.mockResolvedValueOnce({
			data: [
				{ id: "dir_1", state: "active" },
				{ id: "dir_2", state: "inactive" },
				{ id: "dir_3", state: "active" },
			],
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import("../../../utils/authkit-session");
		const handler = (await import("./health.get")).default;
		const event = createTestEvent({
			context: { params: { org: "acme" } },
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});

		const res = await handler(event as any);
		expect(res.orgExternalId).toBe("acme");
		expect(res.organizationId).toBe("org_1");
		expect(res.ssoConnections.count).toBe(2);
		expect(res.ssoConnections.activeCount).toBe(1);
		expect(res.directories.count).toBe(3);
		expect(res.directories.healthyCount).toBe(2);
	});
});
