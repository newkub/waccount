import { describe, expect, it, vi } from "vitest";

import {
	createMockWorkosUser,
	createTestEvent,
	mockWorkos,
	setMockOrgDashboardLayoutRow,
	setTestRuntimeConfig,
} from "../../../test/setup";

describe("server/api/orgs/[org]/dashboard-layout.put", () => {
	it("throws 403 when role not allowed", async () => {
		setTestRuntimeConfig({
			workosApiKey: "api_key",
			workosClientId: "client_id",
			workosCookiePassword: "cookie_password",
		});

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

		mockWorkos.userManagement.listOrganizationMemberships.mockResolvedValueOnce({
			data: [{ id: "m1", userId: "user_1", organizationId: "org_1", status: "active", role: "member" }],
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import("../../../utils/authkit-session");
		const handler = (await import("./dashboard-layout.put")).default;

		const event = createTestEvent({
			context: { params: { org: "acme" } },
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: { layout: { version: 1, tabs: [] } },
		});

		await expect(handler(event as any)).rejects.toMatchObject({ statusCode: 403 });
	});

	it("upserts layout when admin", async () => {
		setTestRuntimeConfig({
			workosApiKey: "api_key",
			workosClientId: "client_id",
			workosCookiePassword: "cookie_password",
		});

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

		mockWorkos.userManagement.listOrganizationMemberships.mockResolvedValueOnce({
			data: [{ id: "m1", userId: "user_1", organizationId: "org_1", status: "active", role: "admin" }],
		});

		setMockOrgDashboardLayoutRow(null);

		const { WORKOS_SESSION_COOKIE_NAME } = await import("../../../utils/authkit-session");
		const handler = (await import("./dashboard-layout.put")).default;

		const layout = { version: 1, tabs: [{ id: "t1", label: "T1", slots: [] }] };
		const event = createTestEvent({
			context: { params: { org: "acme" } },
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: { layout },
		});

		const res = await handler(event as any);
		expect(res.orgExternalId).toBe("acme");
		expect(res.layout.tabs[0]?.id).toBe("t1");
	});
});
