import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoginForm from "~/components/auth/LoginForm.vue";

describe("LoginForm", () => {
	it("should render login form correctly", () => {
		const wrapper = mount(LoginForm);

		// Check if form elements are rendered
		expect(wrapper.find('input[type="email"]').exists()).toBe(true);
		expect(wrapper.find('input[type="password"]').exists()).toBe(true);
		expect(wrapper.find('[type="submit"]').exists()).toBe(true);
	});

	it("should validate form inputs", async () => {
		const wrapper = mount(LoginForm);

		const emailInput = wrapper.find('input[type="email"]');
		const passwordInput = wrapper.find('input[type="password"]');

		// Test empty inputs - submit button should be disabled
		expect(wrapper.find('[type="submit"]').attributes("disabled")).toBeDefined();

		// Test valid inputs
		await emailInput.setValue("test@example.com");
		await passwordInput.setValue("password123");

		// Submit button should be enabled when form has values
		const submitButton = wrapper.find('[type="submit"]');
		expect(submitButton.attributes("disabled")).toBeUndefined();
	});

	it("should emit success event on form submit", async () => {
		const wrapper = mount(LoginForm);

		const emailInput = wrapper.find('input[type="email"]');
		const passwordInput = wrapper.find('input[type="password"]');
		const form = wrapper.find("form");

		await emailInput.setValue("test@example.com");
		await passwordInput.setValue("password123");
		await form.trigger("submit.prevent");

		expect(wrapper.emitted("success")).toBeTruthy();
	});

	it("should show loading state", () => {
		const wrapper = mount(LoginForm, {
			props: { loading: true },
		});

		const submitButton = wrapper.find('[type="submit"]');
		expect(submitButton.text()).toContain("Signing in");
		expect(submitButton.attributes("disabled")).toBeDefined();
	});

	it("should show custom title and subtitle", () => {
		const wrapper = mount(LoginForm, {
			props: {
				title: "Custom Login",
				subtitle: "Custom subtitle",
			},
		});

		expect(wrapper.text()).toContain("Custom Login");
		expect(wrapper.text()).toContain("Custom subtitle");
	});

	it("should hide sign up link when disabled", () => {
		const wrapper = mount(LoginForm, {
			props: {
				showSignUpLink: false,
			},
		});

		expect(wrapper.text()).not.toContain("Don't have an account?");
	});
});
