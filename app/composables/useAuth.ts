/**
 * @module useAuth
 * @description A facade composable that provides a unified interface for authentication.
 * It combines the state from `useUserState` and actions from `useAuthActions`.
 * This makes it easy for components to interact with the authentication system
 * without needing to know the implementation details of state management or API calls.
 */
export const useAuth = () => {
    const userState = useUserState();
    const authActions = useAuthActions();

    return {
        ...userState,
        ...authActions,
    };
};
