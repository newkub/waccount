export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, name, type, metadata } = body;

	if (!userId || !name || !type) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId, name, and type are required",
		});
	}

	const db = await useDatabase();
	const { projectContexts } = await import("~/server/db/schema");

	const context = await db
		.insert(projectContexts)
		.values({
			userId,
			name,
			type,
			metadata: metadata || null,
		})
		.returning();

	return context[0];
});
