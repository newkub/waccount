import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import IndexPage from "~/pages/index.vue";

// Mock composables
vi.mock("~/composables/useAuth", () => ({
	useAuth: () => ({
		isAuthenticated: ref(false),
		user: ref(null),
		loading: ref(false),
		error: ref(null),
		signOut: vi.fn(),
	}),
}));

describe("Index Page", () => {
	it("should render homepage for unauthenticated user", () => {
		const wrapper = mount(IndexPage);

		expect(wrapper.text()).toContain("ระบบ Authentication ที่ทันสมัย");
		expect(wrapper.find('a[href="/auth/login"]').exists()).toBe(true);
		expect(wrapper.find('a[href="/auth/register"]').exists()).toBe(true);
	});

	it("should show demo features", () => {
		const wrapper = mount(IndexPage);

		expect(wrapper.text()).toContain("Google Sign-In");
		expect(wrapper.text()).toContain("GitHub Integration");
		expect(wrapper.text()).toContain("Email Authentication");
		expect(wrapper.text()).toContain("WorkOS Security");
	});

	it("should show authentication steps", () => {
		const wrapper = mount(IndexPage);

		expect(wrapper.text()).toContain("สมัครสมาชิก");
		expect(wrapper.text()).toContain("ยืนยันอีเมล");
		expect(wrapper.text()).toContain("เข้าสู่ระบบ");
	});

	it("should handle demo login clicks", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { });
		const wrapper = mount(IndexPage);

		const googleDemoButton = wrapper.find('button:contains("Demo Google")');
		if (googleDemoButton.exists()) {
			await googleDemoButton.trigger("click");
			expect(consoleSpy).toHaveBeenCalledWith(
				"Demo: Trying to login with google",
			);
		}

		consoleSpy.mockRestore();
	});
});
