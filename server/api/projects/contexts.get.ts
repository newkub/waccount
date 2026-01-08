export default defineEventHandler(async (event) => {
	const { userId } = getQuery(event);

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId is required",
		});
	}

	const db = await useDatabase();
	const { projectContexts } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const contexts = await db.select().from(projectContexts).where(eq(projectContexts.userId, userId as string));

	return contexts;
});
