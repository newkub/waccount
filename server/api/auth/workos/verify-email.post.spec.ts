import { describe, expect, it, vi } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/verify-email.post", () => {
	it("sends verification email for authenticated user", async () => {
		const user = createMockWorkosUser();
		const session = {
			authenticate: vi
				.fn()
				.mockResolvedValueOnce({ authenticated: true, user }),
			refresh: vi.fn(),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);
		mockWorkos.userManagement.sendVerificationEmail.mockResolvedValueOnce({});

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./verify-email.post")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);

		expect(
			mockWorkos.userManagement.sendVerificationEmail,
		).toHaveBeenCalledWith({ userId: user.id });
		expect(res).toEqual({ success: true });
	});
});
