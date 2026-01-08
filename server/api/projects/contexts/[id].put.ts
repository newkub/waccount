export default defineEventHandler(async (event) => {
	const contextId = getRouterParam(event, "id");
	const body = await readBody(event);

	if (!contextId) {
		throw createError({
			statusCode: 400,
			statusMessage: "contextId is required",
		});
	}

	const db = await useDatabase();
	const { projectContexts } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const context = await db
		.update(projectContexts)
		.set({
			...body,
			updatedAt: new Date(),
		})
		.where(eq(projectContexts.id, contextId))
		.returning();

	if (context.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: "Context not found",
		});
	}

	return context[0];
});
