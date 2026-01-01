import { describe, expect, it, vi } from "vitest";

import { createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/logout.post", () => {
	it("returns success when no session", async () => {
		const { default: handler } = await import("./logout.post");
		const res = await handler(createTestEvent({ __cookies: {} }) as any);
		expect(res).toEqual({ success: true });
	});

	it("returns logoutUrl when session exists", async () => {
		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const session = {
			authenticate: vi.fn(),
			refresh: vi.fn(),
			getLogoutUrl: vi.fn().mockResolvedValueOnce("https://workos/logout"),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);

		const { default: handler } = await import("./logout.post");
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);
		expect(res).toEqual({ success: true, logoutUrl: "https://workos/logout" });
	});
});
