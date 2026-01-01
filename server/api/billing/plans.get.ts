import { defineEventHandler } from "h3";
import { getPlans } from "../../lib/billing";

export default defineEventHandler(async (_event) => {
	return getPlans();
});
