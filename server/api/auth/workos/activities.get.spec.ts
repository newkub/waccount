import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos, setTestRuntimeConfig } from "../../../test/setup";

describe("server/api/auth/workos/activities.get", () => {
	it("returns mapped activities list", async () => {
		setTestRuntimeConfig({
			workosApiKey: "api_key",
			workosClientId: "client_id",
			workosCookiePassword: "cookie_password",
		});

		const user = createMockWorkosUser({ id: "user_123" });
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
			getLogoutUrl: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);
		mockWorkos.events.listEvents.mockResolvedValueOnce({
			data: [
				{
					id: "evt_1",
					event: "user.signed_in",
					createdAt: "2025-01-01T00:00:00.000Z",
					data: { user: { id: "user_123" } },
				},
			],
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./activities.get")).default;
		const res = await handler(
			createTestEvent({
				__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			}) as any,
		);
		expect(res).toEqual({
			activities: [
				{
					id: "evt_1",
					type: "user.signed_in",
					timestamp: "2025-01-01T00:00:00.000Z",
					data: { user: { id: "user_123" } },
				},
			],
		});
	});
});
