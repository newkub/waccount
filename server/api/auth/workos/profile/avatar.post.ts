import { createError, defineEventHandler } from "h3";

export default defineEventHandler(() => {
	throw createError({
		statusCode: 501,
		statusMessage:
			"Avatar upload is not supported by AuthKit. Configure your own storage and update user metadata instead.",
	});
});
