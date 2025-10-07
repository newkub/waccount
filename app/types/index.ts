// Type definitions for authentication and user management
// Using Effect Schema with Functional Programming approach
// All schemas use Schema.Struct for pure FP style (no OOP/classes)
import { Schema } from "effect";

// ============================================================================
// Core User Schema (FP)
// ============================================================================
export const User = Schema.Struct({
	id: Schema.String,
	email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
	name: Schema.String,
	avatar: Schema.optional(Schema.String),
	emailVerified: Schema.optional(Schema.Boolean),
	role: Schema.optional(Schema.String),
	isAdmin: Schema.optional(Schema.Boolean),
	createdAt: Schema.optional(Schema.String),
	updatedAt: Schema.optional(Schema.String),
});
export type User = Schema.Schema.Type<typeof User>;

// ============================================================================
// User Profile Schema (FP)
// ============================================================================
export const UserProfile = Schema.Struct({
	id: Schema.String,
	email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
	name: Schema.String,
	avatar: Schema.optional(Schema.String),
	bio: Schema.optional(Schema.String),
	phone: Schema.optional(Schema.String),
	company: Schema.optional(Schema.String),
	location: Schema.optional(Schema.String),
	website: Schema.optional(Schema.String),
	createdAt: Schema.String,
	updatedAt: Schema.String,
});
export type UserProfile = Schema.Schema.Type<typeof UserProfile>;

// ============================================================================
// Update Profile Data Schema (FP)
// ============================================================================
export const UpdateProfileData = Schema.Struct({
	firstName: Schema.optional(Schema.String),
	lastName: Schema.optional(Schema.String),
	profilePictureUrl: Schema.optional(Schema.String),
});
export type UpdateProfileData = Schema.Schema.Type<typeof UpdateProfileData>;

// ============================================================================
// State Schemas (FP)
// ============================================================================
export const AuthState = Schema.Struct({
	user: Schema.NullOr(User),
	isAuthenticated: Schema.Boolean,
	loading: Schema.Boolean,
});
export type AuthState = Schema.Schema.Type<typeof AuthState>;

export const UserManagementState = Schema.Struct({
	profile: Schema.NullOr(UserProfile),
	loading: Schema.Boolean,
	updating: Schema.Boolean,
	error: Schema.NullOr(Schema.String),
	success: Schema.NullOr(Schema.String),
});
export type UserManagementState = Schema.Schema.Type<typeof UserManagementState>;

// ============================================================================
// API Response Schemas (FP)
// ============================================================================
export const AuthResponse = Schema.Struct({
	user: User,
	token: Schema.optional(Schema.String),
});
export type AuthResponse = Schema.Schema.Type<typeof AuthResponse>;

export const ProfileResponse = Schema.Struct({
	profile: UserProfile,
});
export type ProfileResponse = Schema.Schema.Type<typeof ProfileResponse>;

export const ActivityResponse = Schema.Struct({
	activities: Schema.Array(Schema.Unknown),
});
export type ActivityResponse = Schema.Schema.Type<typeof ActivityResponse>;

// ============================================================================
// WorkOS Specific Schemas (FP)
// ============================================================================
export const WorkOSUser = Schema.Struct({
	id: Schema.String,
	email: Schema.String,
	name: Schema.optional(Schema.String),
	avatar: Schema.optional(Schema.String),
	emailVerified: Schema.optional(Schema.Boolean),
	createdAt: Schema.optional(Schema.String),
	updatedAt: Schema.optional(Schema.String),
});
export type WorkOSUser = Schema.Schema.Type<typeof WorkOSUser>;

export const WorkOSProfile = Schema.Struct({
	id: Schema.String,
	email: Schema.String,
	name: Schema.String,
	avatar: Schema.optional(Schema.String),
	bio: Schema.optional(Schema.String),
	phone: Schema.optional(Schema.String),
	company: Schema.optional(Schema.String),
	location: Schema.optional(Schema.String),
	website: Schema.optional(Schema.String),
	createdAt: Schema.String,
	updatedAt: Schema.String,
});
export type WorkOSProfile = Schema.Schema.Type<typeof WorkOSProfile>;

// ============================================================================
// Form Data Schemas (FP)
// ============================================================================
export const LoginFormData = Schema.Struct({
	email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
	password: Schema.String.pipe(Schema.minLength(8)),
});
export type LoginFormData = Schema.Schema.Type<typeof LoginFormData>;

export const RegisterFormData = Schema.Struct({
	email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
	password: Schema.String.pipe(Schema.minLength(8)),
	confirmPassword: Schema.optional(Schema.String.pipe(Schema.minLength(8))),
	firstName: Schema.optional(Schema.String),
	lastName: Schema.optional(Schema.String),
});
export type RegisterFormData = Schema.Schema.Type<typeof RegisterFormData>;

export const ProfileUpdateFormData = Schema.Struct({
	firstName: Schema.optional(Schema.String),
	lastName: Schema.optional(Schema.String),
	profilePictureUrl: Schema.optional(Schema.String),
});
export type ProfileUpdateFormData = Schema.Schema.Type<typeof ProfileUpdateFormData>;

export const PasswordUpdateFormData = Schema.Struct({
	currentPassword: Schema.String.pipe(Schema.minLength(8)),
	newPassword: Schema.String.pipe(Schema.minLength(8)),
});
export type PasswordUpdateFormData = Schema.Schema.Type<typeof PasswordUpdateFormData>;

// ============================================================================
// Error Schemas (FP)
// ============================================================================
export const AuthError = Schema.Struct({
	message: Schema.String,
	code: Schema.optional(Schema.String),
});
export type AuthError = Schema.Schema.Type<typeof AuthError>;

export const ValidationError = Schema.Struct({
	field: Schema.String,
	message: Schema.String,
});
export type ValidationError = Schema.Schema.Type<typeof ValidationError>;
