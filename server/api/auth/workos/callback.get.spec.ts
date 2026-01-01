import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/callback.get", () => {
	it("rejects when code missing", async () => {
		const handler = (await import("./callback.get")).default;
		await expect(
			handler(createTestEvent({ __query: {} }) as any),
		).rejects.toMatchObject({ statusCode: 400 });
	});

	it("sets cookie then redirects", async () => {
		mockWorkos.userManagement.authenticateWithCode.mockResolvedValueOnce({
			sealedSession: "sealed_new",
			user: {
				email: "a@b.com",
				firstName: null,
				lastName: null,
			},
		});
		const { WORKOS_SESSION_COOKIE_NAME } = await import(
			"../../../utils/authkit-session"
		);

		const handler = (await import("./callback.get")).default;
		const event = createTestEvent({ __query: { code: "abc" } });
		const res = await handler(event as any);

		expect(event.__cookies?.[WORKOS_SESSION_COOKIE_NAME]).toBe("sealed_new");
		expect(res).toEqual({ location: "/a", statusCode: 302 });
	});
});
