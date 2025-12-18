// This endpoint is now protected by the auth middleware, which populates `event.context.user`

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return { profile: event.context.user };
});
