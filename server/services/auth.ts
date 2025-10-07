// Auth service using WorkOS SDK
// All authentication logic centralized here
import { Effect, pipe } from "effect";
import { getWorkOS, getWorkOSClientId } from "../integrations/workos";
import { User } from "~/types";

/**
 * Sign in with email and password
 */
export const signInWithPassword = (email: string, password: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				// WorkOS password authentication
				const result = await workos.userManagement.authenticateWithPassword({
					clientId: getWorkOSClientId(),
					email,
					password,
				});
				return result;
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to sign in with password"),
		}),
		Effect.map((result) => ({
			user: {
				id: result.user.id,
				email: result.user.email,
				name: result.user.firstName
					? `${result.user.firstName} ${result.user.lastName || ""}`.trim()
					: result.user.email,
				avatar: result.user.profilePictureUrl
					? result.user.profilePictureUrl
					: undefined,
				emailVerified: result.user.emailVerified,
				role: (result.user as any).role ? (result.user as any).role : undefined,
				isAdmin: (result.user as any).isAdmin
					? (result.user as any).isAdmin
					: undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		})),
	);

/**
 * Sign up with email and password
 */
export const signUpWithPassword = (
	email: string,
	password: string,
	userData?: { firstName?: string; lastName?: string },
) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				const result = await workos.userManagement.createUser({
					email,
					password,
					firstName: userData?.firstName,
					lastName: userData?.lastName,
					emailVerified: false,
				});
				return result;
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to create account"),
		}),
		Effect.map((result) => ({
			user: {
				id: result.id,
				email: result.email,
				name: result.firstName
					? `${result.firstName} ${result.lastName || ""}`.trim()
					: result.email,
				avatar: result.profilePictureUrl || undefined,
				emailVerified: result.emailVerified,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
			},
			message: "Account created successfully. Please verify your email.",
		})),
	);

/**
 * Get authorization URL for OAuth provider
 */
export const getAuthorizationUrl = (provider: string) =>
	Effect.sync(() => {
		const workos = getWorkOS();
		const clientId = getWorkOSClientId();
		// Generate WorkOS OAuth URL
		const authUrl = workos.userManagement.getAuthorizationUrl({
			clientId,
			provider,
			redirectUri: process.env.WORKOS_REDIRECT_URI || "",
		});
		return { authorizationUrl: authUrl };
	});

/**
 * Send magic link for passwordless authentication
 */
export const sendMagicLink = (email: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.sendMagicAuthCode({
					email,
				});
				return { success: true };
			},
			catch: (err: any) =>
				new Error(err?.message || "Failed to send magic link"),
		}),
	);

/**
 * Verify magic link token
 */
export const verifyMagicLink = (token: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				const result = await workos.userManagement.authenticateWithCode({
					clientId: getWorkOSClientId(),
					code: token,
				});
				return result;
			},
			catch: (err: any) =>
				new Error(err?.message || "Invalid or expired magic link"),
		}),
		Effect.map((result) => ({
			user: {
				id: result.user.id,
				email: result.user.email,
				name: result.user.firstName
					? `${result.user.firstName} ${result.user.lastName || ""}`.trim()
					: result.user.email,
				avatar: result.user.profilePictureUrl ?? undefined,
				emailVerified: result.user.emailVerified,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			accessToken: result.accessToken,
		})),
	);

/**
 * Verify email with token
 */
export const verifyEmail = (token: string, userId: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				await workos.userManagement.verifyEmail({
					userId,
					code: token,
				});
				return { success: true };
			},
			catch: (err: any) => new Error(err?.message || "Failed to verify email"),
		}),
	);

/**
 * Get user by ID
 */
export const getUserById = (userId: string) =>
	pipe(
		Effect.tryPromise({
			try: async () => {
				const workos = getWorkOS();
				const result = await workos.userManagement.getUser(userId);
				return result;
			},
			catch: (err: any) => new Error(err?.message || "Failed to fetch user"),
		}),
		Effect.map((result) => ({
			id: result.id,
			email: result.email,
			name: result.firstName
				? `${result.firstName} ${result.lastName || ""}`.trim()
				: result.email,
			avatar: result.profilePictureUrl || undefined,
			emailVerified: result.emailVerified,
			role: (result as any).role || undefined,
			isAdmin: (result as any).isAdmin || undefined,
			createdAt: result.createdAt,
			updatedAt: result.updatedAt,
		})),
	);
