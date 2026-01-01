import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos, setMockOrgDashboardLayoutRow } from "../../../test/setup";

describe("server/api/orgs/[org]/dashboard-layout.get", () => {
	it("returns default layout when no saved layout", async () => {
		const user = createMockWorkosUser({ id: "user_1" });
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce({
			authenticate: vi.fn().mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		});

		setMockOrgDashboardLayoutRow(null);

		mockWorkos.organizations.getOrganizationByExternalId.mockResolvedValueOnce({
			id: "org_1",
			externalId: "acme",
			name: "acme",
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import("../../../utils/authkit-session");
		const handler = (await import("./dashboard-layout.get")).default;

		const event = createTestEvent({
			context: { params: { org: "acme" } },
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});

		const res = await handler(event as any);
		expect(res.orgExternalId).toBe("acme");
		expect(res.userId).toBe("user_1");
		expect(res.layout.version).toBe(1);
		expect(res.layout.tabs.length).toBeGreaterThan(0);
	});

	it("returns saved layout when exists", async () => {
		const user = createMockWorkosUser({ id: "user_1" });
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce({
			authenticate: vi.fn().mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		});

		setMockOrgDashboardLayoutRow({
			id: "row_1",
			orgExternalId: "acme",
			userId: "user_1",
			layout: { version: 1, tabs: [{ id: "x", label: "X", slots: [] }] },
		});

		mockWorkos.organizations.getOrganizationByExternalId.mockResolvedValueOnce({
			id: "org_1",
			externalId: "acme",
			name: "acme",
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import("../../../utils/authkit-session");
		const handler = (await import("./dashboard-layout.get")).default;

		const event = createTestEvent({
			context: { params: { org: "acme" } },
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});

		const res = await handler(event as any);
		expect(res.layout.tabs[0]?.id).toBe("x");
	});
});
