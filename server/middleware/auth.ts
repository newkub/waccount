import { refreshSession, setAuthCookies } from '../utils/auth';

// This middleware runs on every request to the server.
// It checks for a refresh token and attempts to refresh the session if the access token is not present or invalid.
export default defineEventHandler(async (event) => {
  // Public routes do not need session checks
  const path = getRequestPath(event);
  if (path.startsWith('/api/auth/workos') || path === '/') {
    return;
  }

  const accessToken = getCookie(event, 'workos-session');

  // If we have an access token, we can assume the user is authenticated for this request.
  // A robust solution would verify the token's signature and expiration here.
  // For this project's current structure, we rely on the refresh mechanism.
  if (accessToken) {
    return;
  }

  const refreshToken = getCookie(event, 'workos-refresh');

  if (refreshToken) {
    try {
      const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);
      setAuthCookies(event, newAccessToken, newRefreshToken);
      event.context.user = user;
    } catch (error) {
      console.error('Session refresh failed in middleware:', error);
      // If refresh fails, clear context and let the endpoint handle the unauthorized access
      event.context.user = null;
    }
  }
});
