import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuth } from "~/composables/useAuth";

describe("useAuth", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("should initialize with default values", () => {
		const { user, isAuthenticated, loading, error, success } = useAuth();

		expect(user.value).toBe(null);
		expect(isAuthenticated.value).toBe(false);
		expect(loading.value).toBe(false);
		expect(error.value).toBe(null);
		expect(success.value).toBe(null);
	});
});
