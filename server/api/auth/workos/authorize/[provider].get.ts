import { defineEventHandler, getRouterParams, createError } from 'h3';
import { getWorkosAuthkitConfig } from '../../../../utils/authkit-session';
import { useRuntimeConfig } from 'nitropack/runtime';

const SUPPORTED_PROVIDERS = ["google", "microsoft"];

export default defineEventHandler(async (event) => {
  const { provider } = getRouterParams(event);

  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported provider: ${provider}`,
    });
  }

  const { workos, clientId } = getWorkosAuthkitConfig();

  const authorizationUrl = await workos.userManagement.getAuthorizationUrl({
    provider: provider as 'google' | 'microsoft',
    clientId,
    redirectUri: new URL("/api/auth/workos/callback", useRuntimeConfig().public.baseUrl).href,
  });

  return { authorizationUrl };
});
