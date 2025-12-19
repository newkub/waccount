import { setAuthCookies, authenticateWithCode } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
    const { code } = getQuery(event);

    if (!code || typeof code !== 'string') {
        return sendRedirect(event, '/auth/login?error=invalid_code');
    }

    try {
        const { user, accessToken, refreshToken } = await authenticateWithCode(code as string);

        setAuthCookies(event, user.id, accessToken, refreshToken);
        
        // @ai: The redirect URL should probably go to a generic dashboard/account page, not a user-specific one.
        // For now, I'll keep it, but this is a candidate for improvement.
        return sendRedirect(event, `/${user.id}/profile`);

    } catch (error: any) {
        console.error('OAuth callback error:', error);
        return sendRedirect(event, `/auth/login?error=${encodeURIComponent(error.message)}`);
    }
});
