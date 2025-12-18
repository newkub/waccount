import type { User } from '~/shared/types';

/**
 * @module useUserState
 * @description A composable for managing the global user state.
 * This includes the user object, authentication status, and UI feedback states (loading, error, success).
 */
export const useUserState = () => {
    /** The global user state, shared across the application. */
    const user = useState<User | null>('user', () => null);
    /** A reactive flag for loading states during API calls. */
    const loading = ref(false);
    /** A reactive string to hold error messages. */
    const error = ref<string | null>(null);
    /** A reactive string to hold success messages. */
    const success = ref<string | null>(null);

    /** A computed property to easily check if the user is authenticated. */
    const isAuthenticated = computed(() => !!user.value);

    /** Clears any existing error and success messages. */
    const clearMessages = () => {
        error.value = null;
        success.value = null;
    };

    /**
     * Sets the current user state.
     * @param {User | null} newUser The new user object or null to clear the session.
     */
    const setUser = (newUser: User | null) => {
        user.value = newUser;
    };

    return {
        user,
        loading,
        error,
        success,
        isAuthenticated,
        clearMessages,
        setUser,
    };
};
