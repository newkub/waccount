import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserManagement } from "~/composables/useUserManagement";

// Mock WorkOS
vi.mock("@workos-inc/node");
vi.mock("#app/composables/config", () => ({
	useRuntimeConfig: () => ({
		WORKOS_API_KEY: "test-api-key",
	}),
}));

describe("useUserManagement", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should initialize with default state", () => {
		const { loading, error, success } = useUserManagement();

		expect(loading.value).toBe(false);
		expect(error.value).toBe(null);
		expect(success.value).toBe(null);
	});

	it("should clear messages correctly", () => {
		const { clearMessages, error, success } = useUserManagement();

		clearMessages();
		expect(error.value).toBe(null);
		expect(success.value).toBe(null);
	});

	// TODO: Add tests for getUserStats and getRecentActivity when implemented
	// These methods are not yet implemented in useUserManagement
});
