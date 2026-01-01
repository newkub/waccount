import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/profile.get", () => {
	it("returns mapped user for authenticated session", async () => {

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
		const handler = (await import("./profile.get")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);
		expect(res.user.id).toBe("user_123");
	});
});
