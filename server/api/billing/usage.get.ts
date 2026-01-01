import { defineEventHandler } from "h3";
import { getUsage } from "../../lib/billing";

export default defineEventHandler(async (_event) => {
	return getUsage();
});
