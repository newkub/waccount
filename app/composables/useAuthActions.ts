import type { User } from '~/shared/types';

export const useAuthActions = () => {
    const { user, loading, error, success, setUser } = useUserState();
    const apiHandler = useApiHandler(loading, error, success);

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

    const signUp = (email: string, password: string, userData?: { firstName?: string; lastName?: string }) =>
        apiHandler.handle(
            () => $fetch('/api/auth/workos/register', { method: 'POST', body: { email, password, ...userData } }),
            {
                successMessage: 'Account created. Please check your email for verification.',
                errorMessage: 'Failed to create account',
            }
        );

    const signInWithProvider = (provider: string) =>
        apiHandler.handle(
            () => $fetch<{ authorizationUrl: string }>(`/api/auth/workos/authorize/${provider}`),
            {
                errorMessage: `Failed to sign in with ${provider}`,
                onSuccess: (response: { authorizationUrl: string } | null) => {
                    if (response) window.location.href = response.authorizationUrl;
                },
            }
        );

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
        signInWithProvider,
        signOut,
        refreshUser,
    };
};
