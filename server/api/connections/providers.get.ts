import { defineEventHandler } from "h3";
import { getProviders } from "../../lib/connections";

export default defineEventHandler(async (_event) => {
	return getProviders();
});
