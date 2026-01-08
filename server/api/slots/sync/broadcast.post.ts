export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { type, userId, projectContext, ...payload } = body;

	if (!type || !userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "type and userId are required",
		});
	}

	return {
		success: true,
		type,
		timestamp: new Date().toISOString(),
	};
});
