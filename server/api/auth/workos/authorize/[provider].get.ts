import { getWorkOS, getWorkOSClientId, getWorkOSRedirectUri } from '../../../../lib/workos';

export default defineEventHandler(async (event) => {
  try {
    const provider = event.context.params?.provider as string;

    if (!provider) {
      throw new Error('Provider not specified');
    }

    const workos = getWorkOS();
    const clientId = getWorkOSClientId();
    const redirectUri = getWorkOSRedirectUri();

    const authorizationUrl = await workos.sso.getAuthorizationUrl({
      provider,
      redirectUri,
      clientId,
    });

    return sendRedirect(event, authorizationUrl);
  } catch (error) {
    console.error('Authorization error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate authorization URL',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});
