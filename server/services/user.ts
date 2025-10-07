// User management service using WorkOS SDK
import { Effect, pipe } from "effect";
import { getWorkOS } from "../integrations/workos";
import { UserProfile, type UpdateProfileData } from "~/types";

/**
 * Get user profile by ID
 */
export const getUserProfile = (userId: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				const user = await workos.userManagement.getUser(userId);
				return user;
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to fetch user profile"),
		}),
		Effect.map((user) => ({
			id: user.id,
			email: user.email,
			name: user.firstName
				? `${user.firstName} ${user.lastName || ""}`.trim()
				: user.email,
			avatar: user.profilePictureUrl,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})),
	);

/**
 * Update user profile
 */
export const updateUserProfile = (userId: string, data: UpdateProfileData) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				const user = await workos.userManagement.updateUser({
					userId,
					firstName: data.firstName,
					lastName: data.lastName,
					...(data.profilePictureUrl && {
						profilePictureUrl: data.profilePictureUrl,
					}),
				});
				return user;
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to update profile"),
		}),
		Effect.map((user) => ({
			id: user.id,
			email: user.email,
			name: user.firstName
				? `${user.firstName} ${user.lastName || ""}`.trim()
				: user.email,
			avatar: user.profilePictureUrl,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})),
	);

/**
 * Delete user account
 */
export const deleteUserAccount = (userId: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.deleteUser(userId);
				return { success: true };
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to delete account"),
		}),
	);

/**
 * Update user password
 */
export const updateUserPassword = (
	userId: string,
	newPassword: string,
	passwordResetUrl: string,
) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.resetPassword({
					passwordResetToken: userId, // Assuming userId is token here
					newPassword,
				});
				return { success: true };
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to update password"),
		}),
	);

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = (
	email: string,
	passwordResetUrl: string,
) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.sendPasswordResetEmail({
					email,
					passwordResetUrl,
				});
				return { success: true };
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to send reset email"),
		}),
	);

/**
 * Send verification email
 */
export const sendVerificationEmail = (userId: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.sendVerificationEmail({
					userId,
				});
				return { success: true };
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to send verification email"),
		}),
	);
