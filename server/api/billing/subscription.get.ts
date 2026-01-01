import { defineEventHandler } from "h3";
import { getSubscription } from "../../lib/billing";

export default defineEventHandler(async (_event) => {
	return getSubscription();
});
