export default defineEventHandler(async (event) => {
	const { userId, projectContext } = getQuery(event);

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId is required",
		});
	}

	const db = await useDatabase();
	const { slotLayouts } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const layout = await db
		.select()
		.from(slotLayouts)
		.where(
			and(
				eq(slotLayouts.userId, userId as string),
				projectContext ? eq(slotLayouts.projectContext, projectContext as string) : undefined,
			),
		)
		.limit(1);

	if (layout.length === 0) {
		const { slotConfigs } = await import("~/server/db/schema");
		const configs = await db.select().from(slotConfigs);

		const newLayout = await db
			.insert(slotLayouts)
			.values({
				userId: userId as string,
				projectContext: projectContext as string | null,
				slots: configs.map((config) => ({
					slotId: config.id,
					visible: config.defaultVisible,
					order: config.defaultOrder,
					pinned: false,
				})),
			})
			.returning();

		return newLayout[0];
	}

	return layout[0];
});
