import { describe, expect, it } from "vitest";

import { createMockWorkosUser } from "../test/setup";

describe("server/utils/workos-user", () => {
	it("mapWorkosUserToAppUser maps fields and normalizes undefined to null", async () => {
		const { mapWorkosUserToAppUser } = await import("./workos-user");
		const mapped = mapWorkosUserToAppUser(
			createMockWorkosUser({
				firstName: undefined,
				lastName: undefined,
				profilePictureUrl: undefined,
			}),
		);

		expect(mapped).toEqual({
			id: "user_123",
			email: "test@example.com",
			firstName: null,
			lastName: null,
			emailVerified: true,
			avatar: null,
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z",
		});
	});
});
