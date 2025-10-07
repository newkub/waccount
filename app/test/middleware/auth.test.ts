import { describe, it, expect, vi } from "vitest";
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
		const to = { path: "/profile" };
		const from = { path: "/" };

		const result = authMiddleware(to, from);

		expect(mockNavigateTo).toHaveBeenCalledWith("/auth/login");
	});
});
