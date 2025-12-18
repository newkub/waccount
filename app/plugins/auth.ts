/**
 * Nuxt plugin to initialize the user's authentication state.
 * It attempts to refresh the user session on the initial load (both SSR and client-side).
 */
export default defineNuxtPlugin(async () => {
    const { isAuthenticated, refreshUser } = useAuth();

    // If user is already authenticated (e.g., from a previous client-side navigation), do nothing.
    if (isAuthenticated.value) {
        return;
    }

    try {
        await refreshUser();
    } catch (error) {
        // This is a normal occurrence if the user is not logged in or the refresh token is expired.
        // We don't need to log this as an error in production.
        if (process.dev) {
            console.log("Auth plugin: No active session or session expired.");
        }
    }
});
