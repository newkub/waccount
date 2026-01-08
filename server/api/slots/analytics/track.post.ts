export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, slotId, projectContext } = body;

	if (!userId || !slotId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId and slotId are required",
		});
	}

	const db = await useDatabase();
	const { slotAnalytics } = await import("~/server/db/schema");
	const { eq, and, sql } = await import("drizzle-orm");

	const existing = await db
		.select()
		.from(slotAnalytics)
		.where(
			and(
				eq(slotAnalytics.userId, userId),
				eq(slotAnalytics.slotId, slotId),
				projectContext ? eq(slotAnalytics.projectContext, projectContext) : undefined,
			),
		)
		.limit(1);

	if (existing.length === 0) {
		await db.insert(slotAnalytics).values({
			userId,
			slotId,
			projectContext,
			viewCount: 1,
			lastViewedAt: new Date(),
		});
	} else {
		await db
			.update(slotAnalytics)
			.set({
				viewCount: sql`${slotAnalytics.viewCount} + 1`,
				lastViewedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(slotAnalytics.id, existing[0].id));
	}

	return { success: true };
});
