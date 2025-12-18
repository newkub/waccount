// User management service using WorkOS SDK
import { getWorkOS } from "../integrations/workos";
import type { User as WorkOSUser } from "@workos-inc/node";
import type { UpdateProfileData, User } from "~/app/shared/types";

export const mapWorkOSUserToUser = (workosUser: WorkOSUser): User => ({
	id: workosUser.id,
	email: workosUser.email,
	firstName: workosUser.firstName,
	lastName: workosUser.lastName,
	emailVerified: workosUser.emailVerified,
	profilePictureUrl: workosUser.profilePictureUrl,
	createdAt: workosUser.createdAt,
	updatedAt: workosUser.updatedAt,
});

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string) => {
	try {
		const workos = getWorkOS();
		const user = await workos.userManagement.getUser(userId);
		return mapWorkOSUserToUser(user);
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to fetch user profile";
		throw new Error(message);
	}
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
	userId: string,
	data: UpdateProfileData,
) => {
	try {
		const workos = getWorkOS();
		const user = await workos.userManagement.updateUser({
			userId,
			firstName: data.firstName,
			lastName: data.lastName,
			...(data.profilePictureUrl && {
				profilePictureUrl: data.profilePictureUrl,
			}),
		});
		return mapWorkOSUserToUser(user);
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to update profile";
		throw new Error(message);
	}
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: string) => {
	try {
		const workos = getWorkOS();
		await workos.userManagement.deleteUser(userId);
		return { success: true };
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to delete account";
		throw new Error(message);
	}
};

/**
 * Update user password
 */
export const updateUserPassword = async (
	userId: string,
	newPassword: string,
	_passwordResetUrl: string,
) => {
	try {
		const workos = getWorkOS();
		await workos.userManagement.resetPassword({
			passwordResetToken: userId, // Assuming userId is token here
			newPassword,
		});
		return { success: true };
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to update password";
		throw new Error(message);
	}
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
	email: string,
	passwordResetUrl: string,
) => {
	try {
		const workos = getWorkOS();
		await workos.userManagement.sendPasswordResetEmail({
			email,
			passwordResetUrl,
		});
		return { success: true };
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to send reset email";
		throw new Error(message);
	}
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (userId: string) => {
	try {
		const workos = getWorkOS();
		await workos.userManagement.sendVerificationEmail({
			userId,
		});
		return { success: true };
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to send verification email";
		throw new Error(message);
	}
};
