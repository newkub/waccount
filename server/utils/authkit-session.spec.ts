import { describe, expect, it, vi } from "vitest";

import { createTestEvent, mockWorkos } from "../test/setup";

describe("server/utils/authkit-session", () => {

	it("setSealedSessionCookie writes httpOnly cookie", async () => {
		const { setSealedSessionCookie, WORKOS_SESSION_COOKIE_NAME } = await import(
			"./authkit-session"
		);
		const event = createTestEvent();
		setSealedSessionCookie(event as any, "sealed");
		expect(event.__cookies?.[WORKOS_SESSION_COOKIE_NAME]).toBe("sealed");
		expect(event.__setCookies?.[0]?.name).toBe(WORKOS_SESSION_COOKIE_NAME);
	});

	it("clearSealedSessionCookie deletes cookie", async () => {
		const { clearSealedSessionCookie, WORKOS_SESSION_COOKIE_NAME } = await import("./authkit-session");
		const event = createTestEvent();
		clearSealedSessionCookie(event as any);
		expect(
			event.__deletedCookies?.some(
				(c) => c.name === WORKOS_SESSION_COOKIE_NAME,
			),
		).toBe(true);
	});

	it("loadSessionFromCookie returns null when cookie missing", async () => {
		const { loadSessionFromCookie } = await import("./authkit-session");
		const event = createTestEvent();
		const session = await loadSessionFromCookie(event as any);
		expect(session).toBeNull();
	});

	it("loadSessionFromCookie calls workos.userManagement.loadSealedSession", async () => {
		mockWorkos.userManagement.loadSealedSession.mockResolvedValueOnce({
			authenticate: vi.fn(),
			refresh: vi.fn(),
			getLogoutUrl: vi.fn(),
		});
		const { loadSessionFromCookie, WORKOS_SESSION_COOKIE_NAME } = await import(
			"./authkit-session"
		);
		const event = createTestEvent({
			__cookies: { [WORKOS_SESSION_COOKIE_NAME]: "sealed" },
		});
		await loadSessionFromCookie(event as any);
		expect(mockWorkos.userManagement.loadSealedSession).toHaveBeenCalledWith({
			sessionData: "sealed",
			cookiePassword: "cookie_password",
		});
	});
});
