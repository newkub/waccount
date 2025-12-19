import { refreshSession, setAuthCookies, clearAuthCookies } from '../utils/auth';
import { getUserProfile } from '../utils/user';

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event);
  // Public routes that don't need user context
  const publicRoutes = ['/api/auth/workos/login', '/api/auth/workos/register', '/api/auth/workos/callback', '/api/auth/workos/magic-link', '/'];
  if (publicRoutes.some(p => path.startsWith(p))) {
    return;
  }

  try {
    const userId = getCookie(event, 'user-id');
    const accessToken = getCookie(event, 'workos-session');

    if (userId && accessToken) {
      // We have a user and a session, fetch the full user profile
      // A more optimized approach might be to store a lean user object in the session cookie
      // or use a separate session store like Redis.
      event.context.user = await getUserProfile(userId);
      return; // User is authenticated
    }

    const refreshToken = getCookie(event, 'workos-refresh');
    if (refreshToken) {
      // Access token is missing or expired, try to refresh
      const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);
      setAuthCookies(event, user.id, newAccessToken, newRefreshToken);
      event.context.user = user;
    } else {
      // No session information, user is not authenticated
      event.context.user = null;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    // If any error occurs (e.g., invalid token, failed refresh), clear cookies and context
    clearAuthCookies(event);
    event.context.user = null;
  }
});
