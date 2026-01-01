import type { H3Event } from 'h3';
import { createError } from 'h3';
import { unsealSession, sealSession } from './authkit-session';

export const requireAuthenticatedAuthkitSession = async (event: H3Event) => {
  const session = await unsealSession(event);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
  }

  const authResponse = await session.authenticate();
  if (authResponse.authenticated) {
    return { session, user: authResponse.user };
  }

  const refreshResponse = await session.refresh();
  if (!refreshResponse.authenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
  }

  if (refreshResponse.sealedSession) {
    await sealSession(event, refreshResponse.sealedSession);
  }

  return { session, user: refreshResponse.user };
};
