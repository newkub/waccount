import { defineEventHandler } from 'h3';
import { changePlan } from '~/server/lib/billing';

export default defineEventHandler(async (event) => {
  const { newPlanId } = await readBody(event);
  return changePlan(newPlanId);
});
