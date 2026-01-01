import { defineEventHandler } from 'h3';
import { cancelSubscription } from '~/server/lib/billing';

export default defineEventHandler(async (_event) => {
  return cancelSubscription();
});
