import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/profile.patch", () => {
	it("rejects when no profile fields provided", async () => {
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
		const { default: handler } = await import("./profile.patch");
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: {},
		});
		await expect(handler(event as any)).rejects.toMatchObject({
			statusCode: 400,
		});
	});

	it("updates profile and returns mapped profile", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);
		mockWorkos.userManagement.updateUser.mockResolvedValueOnce(user);

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const { default: handler } = await import("./profile.patch");
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: { firstName: "New" },
		});
		const res = await handler(event as any);
		expect(mockWorkos.userManagement.updateUser).toHaveBeenCalled();
		expect(res.profile.id).toBe("user_123");
	});
});
