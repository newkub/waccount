import { defineEventHandler, getRouterParams, createError, useRuntimeConfig } from 'h3';
import { createWorkos } from '../../../../utils/workos';

const SUPPORTED_PROVIDERS = ["google", "microsoft"];

export default defineEventHandler(async (event) => {
  const { provider } = getRouterParams(event);

  if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported provider: ${provider}`,
    });
  }

  const workos = createWorkos(event);
  const config = useRuntimeConfig(event);

  const authorizationUrl = await workos.userManagement.getAuthorizationUrl({
    provider: provider as 'google' | 'microsoft',
    clientId: config.public.workosClientId,
    redirectUri: new URL("/api/auth/workos/callback", config.public.baseUrl).href,
  });

  return { authorizationUrl };
});
