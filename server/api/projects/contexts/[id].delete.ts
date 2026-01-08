export default defineEventHandler(async (event) => {
	const contextId = getRouterParam(event, "id");

	if (!contextId) {
		throw createError({
			statusCode: 400,
			statusMessage: "contextId is required",
		});
	}

	const db = await useDatabase();
	const { projectContexts } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	await db.delete(projectContexts).where(eq(projectContexts.id, contextId));

	return { success: true };
});
