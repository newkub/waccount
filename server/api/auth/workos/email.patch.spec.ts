import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/email.patch", () => {
	it("rejects missing email", async () => {

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
		const handler = (await import("./email.patch")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: {},
		});
		await expect(handler(event as any)).rejects.toMatchObject({
			statusCode: 400,
		});
	});

	it("updates email and sends verification", async () => {

		const user = createMockWorkosUser();
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);
		mockWorkos.userManagement.updateUser.mockResolvedValueOnce({});
		mockWorkos.userManagement.sendVerificationEmail.mockResolvedValueOnce({});

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./email.patch")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
			__body: { email: "new@b.com" },
		});
		const res = await handler(event as any);

		expect(mockWorkos.userManagement.updateUser).toHaveBeenCalled();
		expect(
			mockWorkos.userManagement.sendVerificationEmail,
		).toHaveBeenCalledWith({ userId: user.id });
		expect(res).toEqual({ success: true });
	});
});
