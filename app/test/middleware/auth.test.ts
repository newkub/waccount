import { describe, it, expect, beforeEach, vi } from "vitest";
import authMiddleware from "~/middleware/auth";

// Mock Nuxt functions
const mockNavigateTo = vi.fn();
vi.mock("#app/composables/router", () => ({
	navigateTo: mockNavigateTo,
}));

vi.mock("~/composables/useAuth", () => ({
	useAuth: () => ({
		isAuthenticated: ref(false),
	}),
}));

describe("Auth Middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should redirect unauthenticated users to login", () => {
		const to = { path: "/profile", name: undefined, params: {}, query: {}, hash: "", fullPath: "/profile", matched: [], redirectedFrom: undefined, meta: {} } as any;
		const from = { path: "/", name: undefined, params: {}, query: {}, hash: "", fullPath: "/", matched: [], redirectedFrom: undefined, meta: {} } as any;

		const _result = authMiddleware(to, from);

		expect(mockNavigateTo).toHaveBeenCalledWith("/auth/login");
	});
});
