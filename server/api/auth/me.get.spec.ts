import type { H3Event } from "h3";
import { describe, expect, it } from "vitest";
import meEventHandler from "./me.get";

describe("GET /api/auth/me", () => {
	it("should return user data if user is authenticated", async () => {
		const mockUser = { id: "user-1", email: "test@example.com" };
		const mockEvent = { context: { user: mockUser } } as H3Event;
		const result = await meEventHandler(mockEvent);

		expect(result).toEqual(mockUser);
	});

	it("should return null if user is not authenticated", async () => {
		const mockEvent = { context: { user: null } } as H3Event;
		const result = await meEventHandler(mockEvent);

		expect(result).toBe(null);
	});
});
