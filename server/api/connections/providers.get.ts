import { defineEventHandler } from 'h3';
import { getProviders } from '~/server/lib/connections';

export default defineEventHandler(async (_event) => {
  return getProviders();
});
