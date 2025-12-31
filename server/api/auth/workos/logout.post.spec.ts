import { describe, expect, it, vi } from "vitest";

import { createTestEvent, mockWorkos, setTestRuntimeConfig } from "../../../test/setup";

const setCfg = () => {
	setTestRuntimeConfig({
		workosApiKey: "api_key",
		workosClientId: "client_id",
		workosCookiePassword: "cookie_password",
	});
};

describe("server/api/auth/workos/logout.post", () => {
	it("returns success when no session", async () => {
		setCfg();
		const handler = (await import("./logout.post")).default;
		const res = await handler(createTestEvent({ __cookies: {} }) as any);
		expect(res).toEqual({ success: true });
	});

	it("returns logoutUrl when session exists", async () => {
		setCfg();
		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const session = {
			authenticate: vi.fn(),
			refresh: vi.fn(),
			getLogoutUrl: vi.fn().mockResolvedValueOnce("https://workos/logout"),
		};
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce(session);

		const handler = (await import("./logout.post")).default;
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		const res = await handler(event as any);
		expect(res).toEqual({ success: true, logoutUrl: "https://workos/logout" });
	});
});
