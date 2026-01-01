import { defineEventHandler } from 'h3';
import { listInvoices } from '~/server/lib/billing';

export default defineEventHandler(async (_event) => {
  return listInvoices();
});
