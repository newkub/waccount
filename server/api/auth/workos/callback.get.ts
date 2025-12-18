import { getWorkOS, getWorkOSClientId } from "../../../integrations/workos";
import { setAuthCookies } from "../../../utils/auth";
import { callWorkOS } from "../../../utils/api";

export default defineEventHandler(async (event) => {
    const { code } = getQuery(event);

    if (!code || typeof code !== 'string') {
        return sendRedirect(event, '/auth/login?error=invalid_code');
    }

    try {
        const workos = getWorkOS();
        const result = await callWorkOS(
            () => workos.userManagement.authenticateWithCode({
                clientId: getWorkOSClientId(),
                code,
            }),
            'Failed to authenticate with OAuth provider'
        );

        setAuthCookies(event, result.accessToken, result.refreshToken);
        
        // Redirect to the user's profile page after successful login
        return sendRedirect(event, `/${result.user.id}/profile`);

    } catch (error: any) {
        console.error('OAuth callback error:', error);
        return sendRedirect(event, `/auth/login?error=${encodeURIComponent(error.message)}`);
    }
});
