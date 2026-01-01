import { defineEventHandler } from 'h3';
import { refreshConnection } from '~/server/lib/connections';

export default defineEventHandler(async (event) => {
  const connectionId = event.context.params?.id as string;
  return refreshConnection(connectionId);
});
