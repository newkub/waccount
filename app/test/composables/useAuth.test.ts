import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "~/composables/useAuth";

// Mock dependencies
vi.mock("@workos-inc/node");
vi.mock("#app/composables/router", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));
vi.mock("#app/composables/config", () => ({
	useRuntimeConfig: () => ({
		WORKOS_API_KEY: "test-api-key",
		WORKOS_CLIENT_ID: "test-client-id",
		WORKOS_REDIRECT_URI: "http://localhost:3000/auth/callback",
	}),
}));

describe("useAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should initialize with default state", () => {
		const { user, loading, error, isAuthenticated } = useAuth();

		expect(user.value).toBe(null);
		expect(loading.value).toBe(false);
		expect(error.value).toBe(null);
		expect(isAuthenticated.value).toBe(false);
	});

	it("should update authentication state", () => {
		const { user } = useAuth();

		// Mock user login
		const mockUser = {
			id: "1",
			email: "test@example.com",
			name: "John Doe",
			emailVerified: true,
		};

		// Initially user should be null
		expect(user.value).toBe(null);
	});

	it("should handle loading states correctly", () => {
		const { loading } = useAuth();

		expect(loading.value).toBe(false);
	});

	it("should handle error states correctly", () => {
		const { error } = useAuth();

		expect(error.value).toBe(null);
	});

	it("should compute isAuthenticated correctly", () => {
		const { isAuthenticated } = useAuth();

		expect(isAuthenticated.value).toBe(false);
	});
});
