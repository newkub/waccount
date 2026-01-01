import { defineEventHandler } from "h3";
import { getConnections } from "../../lib/connections";

export default defineEventHandler(async (event) => {
	return getConnections(event);
});
