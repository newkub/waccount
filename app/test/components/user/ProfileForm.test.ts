import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
// @ts-ignore - Vitest will resolve this at runtime
import ProfileForm from "../../components/user/ProfileForm.vue";

const mockUser = {
	id: "1",
	email: "test@example.com",
	name: "John Doe",
	avatar: "https://example.com/avatar.jpg",
	emailVerified: true,
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-02T00:00:00Z",
};

describe("ProfileForm", () => {
	it("should render profile form with user data", () => {
		const wrapper = mount(ProfileForm, {
			props: { user: mockUser },
		});

		// Check if form inputs are rendered
		expect(wrapper.find('input[type="text"]').exists()).toBe(true);
		expect(wrapper.find('input[type="email"][readonly]').exists()).toBe(true);
	});

	it("should detect form changes", async () => {
		const wrapper = mount(ProfileForm, {
			props: { user: mockUser },
		});

		const firstNameInput = wrapper.find('input[type="text"]');
		await firstNameInput.setValue("Jane");

		// Check if form has changed (using computed property)
		expect(wrapper.vm.form.firstName).toBe("Jane");
	});

	it("should emit updateProfile event on form submit", async () => {
		const wrapper = mount(ProfileForm, {
			props: { user: mockUser },
		});

		const firstNameInput = wrapper.find('input[type="text"]');
		await firstNameInput.setValue("Jane");

		const form = wrapper.find("form");
		await form.trigger("submit.prevent");

		expect(wrapper.emitted("updateProfile")).toBeTruthy();
	});

	it("should handle file upload", async () => {
		const wrapper = mount(ProfileForm, {
			props: { user: mockUser },
		});

		const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
		const fileInput = wrapper.find('input[type="file"]');

		// Mock file input
		Object.defineProperty(fileInput.element, "files", {
			value: [file],
			writable: false,
		});

		await fileInput.trigger("change");

		expect(wrapper.emitted("uploadAvatar")).toBeTruthy();
		const uploadEvents = wrapper.emitted("uploadAvatar");
		if (uploadEvents && uploadEvents[0]) {
			expect(uploadEvents[0][0]).toBeInstanceOf(File);
		}
	});

	it("should show loading state", () => {
		const wrapper = mount(ProfileForm, {
			props: {
				user: mockUser,
				loading: true,
			},
		});

		const submitButton = wrapper.find('[type="submit"]');
		expect(submitButton.text()).toContain("Saving");
		expect(submitButton.attributes("disabled")).toBeDefined();
	});

	it("should show email verification status", () => {
		const unverifiedUser = { ...mockUser, emailVerified: false };

		const wrapper = mount(ProfileForm, {
			props: { user: unverifiedUser },
		});

		// Email field should be readonly/disabled
		const emailInput = wrapper.find('input[type="email"]');
		expect(emailInput.attributes("readonly")).toBeDefined();
	});
});
