import { sendVerificationEmail } from '../../../utils/user';
import { defineApiHandler } from '../../../utils/api';

export default defineApiHandler(async (event) => {
  if (!event.context.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
  }
  const userId = event.context.user.id;

  await sendVerificationEmail(userId);

  return { success: true, message: 'Verification email sent.' };
});
