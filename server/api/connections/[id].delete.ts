import { defineEventHandler } from "h3";
import { deleteConnection } from "../../lib/connections";

export default defineEventHandler(async (event) => {
	const connectionId = event.context.params?.id as string;
	return deleteConnection(event, connectionId);
});
