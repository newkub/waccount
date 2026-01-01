import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/register.post", () => {
	it("rejects missing email/password", async () => {
		const { default: handler } = await import("./register.post");
		await expect(
			handler(createTestEvent({ __body: { email: "a@b.com" } }) as any),
		).rejects.toMatchObject({
			statusCode: 400,
		});
	});

	it("creates user and returns success", async () => {
		mockWorkos.userManagement.createUser.mockResolvedValueOnce({});
		mockWorkos.userManagement.authenticateWithPassword.mockResolvedValueOnce({
			sealedSession: "sealed_new",
			user: {
				id: "user_1",
				email: "a@b.com",
				firstName: null,
				lastName: null,
				emailVerified: false,
				profilePictureUrl: null,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				unsafeMetadata: {},
			},
		});
		const { default: handler } = await import("./register.post");
		const res = await handler(
			createTestEvent({ __body: { email: "a@b.com", password: "pw" } }) as any,
		);
		expect(mockWorkos.userManagement.createUser).toHaveBeenCalled();
		expect(res).toHaveProperty("user");
	});
});
