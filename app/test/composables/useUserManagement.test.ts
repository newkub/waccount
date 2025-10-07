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

	it("should provide user stats", async () => {
		const { getUserStats } = useUserManagement();

		const stats = await getUserStats();

		expect(stats).toHaveProperty("totalUsers");
		expect(stats).toHaveProperty("activeUsers");
		expect(stats).toHaveProperty("newUsersThisMonth");
		expect(stats).toHaveProperty("emailVerificationRate");
		expect(typeof stats.totalUsers).toBe("number");
	});

	it("should provide recent activity", async () => {
		const { getRecentActivity } = useUserManagement();

		const activities = await getRecentActivity("test-user-id");

		expect(Array.isArray(activities)).toBe(true);
		if (activities.length > 0) {
			expect(activities[0]).toHaveProperty("id");
			expect(activities[0]).toHaveProperty("type");
			expect(activities[0]).toHaveProperty("description");
			expect(activities[0]).toHaveProperty("timestamp");
		}
	});
});
