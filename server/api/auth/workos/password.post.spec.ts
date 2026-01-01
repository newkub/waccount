import { describe, expect, it } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/password.post", () => {
	it("rejects missing email/password", async () => {
		const handler = (await import("./password.post")).default;
		await expect(
			handler(createTestEvent({ __body: { email: "a@b.com" } }) as any),
		).rejects.toMatchObject({
			statusCode: 400,
		});
	});

	it("sets sealed session cookie and returns mapped user", async () => {
		mockWorkos.userManagement.authenticateWithPassword.mockResolvedValueOnce({
			sealedSession: "sealed_pw",
			user: createMockWorkosUser({ emailVerified: false }),
		});

		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);
		const handler = (await import("./password.post")).default;
		const event = createTestEvent({
			__body: { email: "a@b.com", password: "pw" },
			__headers: { "user-agent": "ua" },
		});
		const res = await handler(event as any);

		expect(event.__cookies?.[WORKOS_SESSION_COOKIE_NAME]).toBe("sealed_pw");
		expect(res.user.id).toBe("user_123");
	});
});
