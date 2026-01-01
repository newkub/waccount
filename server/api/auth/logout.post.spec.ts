import type { H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import logoutEventHandler from "./logout.post";

// Mock clearSession from nuxt-auth-utils
const mockClearSession = vi.fn();
vi.stubGlobal("clearSession", mockClearSession);

describe("POST /api/auth/logout", () => {
	it("should call clearSession and return success", async () => {
		const mockEvent = {} as H3Event;
		const result = await logoutEventHandler(mockEvent);

		expect(mockClearSession).toHaveBeenCalledWith(mockEvent);
		expect(result).toEqual({ success: true });
	});
});
