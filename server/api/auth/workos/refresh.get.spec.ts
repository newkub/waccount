import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/refresh.get", () => {
	it("returns null user when no session cookie", async () => {
		const handler = (await import("./refresh.get")).default;
		const res = await handler(createTestEvent({ __cookies: {} }) as any);
		expect(res).toEqual({ user: null });
	});

	it("returns user when session.authenticate is authenticated", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./refresh.get")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);
		expect(res.user?.id).toBe("user_123");
	});

	it("refreshes session and sets cookie when refresh returns sealedSession", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi.fn().mockResolvedValueOnce({ authenticated: false }),
			refresh: vi.fn().mockResolvedValueOnce({
				authenticated: true,
				user,
				sealedSession: "sealed_new",
			}),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./refresh.get")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);

		expect(event.__cookies?.[WORKOS_SESSION_COOKIE_NAME]).toBe("sealed_new");
		expect(res.user?.id).toBe("user_123");
	});
});
