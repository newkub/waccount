import { defineEventHandler } from 'h3';
import { getConnections } from '~/server/lib/connections';

export default defineEventHandler(async (_event) => {
  return getConnections();
});
