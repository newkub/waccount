import { defineEventHandler } from 'h3';
import { getPlans } from '~/server/lib/billing';

export default defineEventHandler(async (_event) => {
  return getPlans();
});
