import { createError, H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import resetPasswordEventHandler from "./reset-password.post";

// Mocks
const mockResetPassword = vi.fn();
const mockWorkos = {
	userManagement: {
		resetPassword: mockResetPassword,
	},
};
vi.mock("../../../utils/authkit-session", () => ({
	getWorkosAuthkitConfig: () => ({ workos: mockWorkos }),
}));

const mockReadBody = vi.fn();
vi.stubGlobal("readBody", mockReadBody);

describe("POST /api/auth/workos/reset-password", () => {
	const mockEvent = {} as H3Event;

	it("should throw 400 if token or newPassword is missing", async () => {
		const error = createError({ statusCode: 400, statusMessage: "Missing token or newPassword" });

		mockReadBody.mockResolvedValue({ token: "test-token" });
		await expect(resetPasswordEventHandler(mockEvent)).rejects.toThrow(error);

		mockReadBody.mockResolvedValue({ newPassword: "new-password" });
		await expect(resetPasswordEventHandler(mockEvent)).rejects.toThrow(error);
	});

	it("should call resetPassword and return success", async () => {
		const token = "valid-token";
		const newPassword = "a-very-strong-password";
		mockReadBody.mockResolvedValue({ token, newPassword });
		mockResetPassword.mockResolvedValue(undefined);

		const result = await resetPasswordEventHandler(mockEvent);

		expect(result).toEqual({ success: true });
		expect(mockResetPassword).toHaveBeenCalledWith({ token, newPassword });
	});

	it("should propagate errors from WorkOS", async () => {
		const errorMessage = "Invalid token";
		const token = "invalid-token";
		const newPassword = "password";
		mockReadBody.mockResolvedValue({ token, newPassword });
		mockResetPassword.mockRejectedValue(new Error(errorMessage));

		await expect(resetPasswordEventHandler(mockEvent)).rejects.toThrow(errorMessage);
	});
});
