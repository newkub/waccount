import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../test/setup";

describe("server/utils/authkit-guard", () => {
	it("requireAuthenticatedAuthkitSession throws 401 when no session cookie", async () => {
		const { requireAuthenticatedAuthkitSession } = await import(
			"./authkit-guard"
		);
		await expect(
			requireAuthenticatedAuthkitSession(createTestEvent() as any),
		).rejects.toMatchObject({
			statusCode: 401,
		});
	});

	it("requireAuthenticatedAuthkitSession refreshes and sets cookie when needed", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi.fn().mockResolvedValueOnce({ authenticated: false }),
			refresh: vi.fn().mockResolvedValueOnce({
				authenticated: true,
				user,
				sealedSession: "new",
			}),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);

		const { WORKOS_SESSION_COOKIE_NAME } = await import("./authkit-session");
		const { requireAuthenticatedAuthkitSession } = await import(
			"./authkit-guard"
		);
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "old" },
		});

		const res = await requireAuthenticatedAuthkitSession(event as any);
		expect(res.user.id).toBe("user_123");
		expect(event.__cookies?.[WORKOS_SESSION_COOKIE_NAME]).toBe("new");
	});
});
