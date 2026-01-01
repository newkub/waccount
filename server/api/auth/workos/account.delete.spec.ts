import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/account.delete", () => {
	it("deletes user and clears session cookie", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);
		mockWorkos.userManagement.deleteUser.mockResolvedValueOnce({});

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./account.delete")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);

		expect(mockWorkos.userManagement.deleteUser).toHaveBeenCalledWith(user.id);
		expect(
			event.__deletedCookies?.some(
				(c) => c.name === WORKOS_SESSION_COOKIE_NAME,
			),
		).toBe(true);
		expect(res).toEqual({ success: true });
	});
});
