// WorkOS Auth Module Index
// This module handles all WorkOS authentication endpoints
// - authorize: OAuth authorization
// - callback: OAuth callback handler
// - refresh: Refresh user session
// - logout: Clear session
// - password: Password authentication
// - register: User registration
// - profile: User profile management
// - magic-link: Passwordless authentication
// - reset-password: Password reset

export const workosAuthModule = {
	endpoints: [
		"authorize",
		"callback",
		"refresh",
		"logout",
		"password",
		"register",
		"profile",
		"magic-link",
		"reset-password",
	],
};
