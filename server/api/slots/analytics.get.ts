export default defineEventHandler(async (event) => {
	const { userId, projectContext } = getQuery(event);

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId is required",
		});
	}

	const db = await useDatabase();
	const { slotAnalytics } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const analytics = await db
		.select()
		.from(slotAnalytics)
		.where(
			and(
				eq(slotAnalytics.userId, userId as string),
				projectContext ? eq(slotAnalytics.projectContext, projectContext as string) : undefined,
			),
		);

	return analytics;
});
