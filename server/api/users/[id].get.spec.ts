import { describe, expect, it } from "vitest";

import { createMockWorkosUser, createTestEvent, mockWorkos } from "../../test/setup";

describe("server/api/users/[id].get", () => {
	it("rejects missing id param", async () => {
		const handler = (await import("./[id].get")).default;
		await expect(
			handler(createTestEvent({ context: { params: {} } }) as any),
		).rejects.toMatchObject({ statusCode: 400 });
	});

	it("returns mapped user for provided id", async () => {
		mockWorkos.userManagement.getUser.mockResolvedValueOnce(
			createMockWorkosUser({ emailVerified: false }),
		);
		const handler = (await import("./[id].get")).default;
		const event = createTestEvent({ context: { params: { id: "user_123" } } });
		const res = await handler(event as any);
		expect(res.user.id).toBe("user_123");
	});
});
