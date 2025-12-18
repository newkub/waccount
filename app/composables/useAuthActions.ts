import type { User } from '~/shared/types';

/**
 * @module useAuthActions
 * @description A composable that provides all authentication-related actions, such as signing in, signing out, and signing up.
 * It uses `useUserState` for state management and `useApiHandler` for API call handling.
 */
export const useAuthActions = () => {
    const { user, loading, error, success, setUser } = useUserState();
    const apiHandler = useApiHandler(loading, error, success);

    /**
     * Signs in a user with their email and password.
     * @param {string} email The user's email.
     * @param {string} password The user's password.
     */
    const signInWithPassword = (email: string, password: string) =>
        apiHandler.handle(
            () => $fetch<{ user: User }>('/api/auth/workos/password', { method: 'POST', body: { email, password } }),
            {
                successMessage: 'Signed in successfully',
                errorMessage: 'Failed to sign in',
                onSuccess: async (response: { user: User }) => {
                    setUser(response.user);
                    await navigateTo('/profile');
                },
            }
        );

    /**
     * Registers a new user.
     * @param {string} email The new user's email.
     * @param {string} password The new user's password.
     * @param {object} [userData] Optional user data like first and last name.
     */
    const signUp = (email: string, password: string, userData?: { firstName?: string; lastName?: string }) =>
        apiHandler.handle(
            () => $fetch('/api/auth/workos/register', { method: 'POST', body: { email, password, ...userData } }),
            {
                successMessage: 'Account created. Please check your email for verification.',
                errorMessage: 'Failed to create account',
            }
        );

    /**
     * Initiates the OAuth sign-in process for a given provider.
     * @param {string} provider The OAuth provider to use (e.g., 'google', 'github').
     */
    const signInWithOAuth = (provider: string) =>
        apiHandler.handle(
            () => $fetch<{ authorizationUrl: string }>(`/api/auth/workos/authorize/${provider}`),
            {
                errorMessage: `Failed to sign in with ${provider}`,
                onSuccess: (response: { authorizationUrl: string } | null) => {
                    if (response) window.location.href = response.authorizationUrl;
                },
            }
        );

    /**
     * Signs out the current user, clears their state, and redirects to the homepage.
     */
    const signOut = () =>
        apiHandler.handle(
            () => $fetch('/api/auth/workos/logout', { method: 'POST' }),
            {
                successMessage: 'Signed out successfully',
                errorMessage: 'Sign out failed',
                onSuccess: async () => {
                    setUser(null);
                    await navigateTo('/');
                },
                onError: async () => {
                    setUser(null);
                    await navigateTo('/');
                },
            }
        );

    /**
     * Refreshes the current user's session and updates the user state.
     */
    const refreshUser = () =>
        apiHandler.handle(
            () => $fetch<{ user: User }>('/api/auth/workos/refresh'),
            {
                errorMessage: 'Failed to refresh user session',
                onSuccess: (response: { user: User } | null) => {
                    setUser(response?.user || null);
                },
                onError: () => {
                    setUser(null);
                },
            }
        );

    return {
        signInWithPassword,
        signUp,
        signInWithOAuth,
        signOut,
        refreshUser,
    };
};
