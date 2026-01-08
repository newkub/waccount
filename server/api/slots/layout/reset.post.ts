export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, projectContext } = body;

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId is required",
		});
	}

	const db = await useDatabase();
	const { slotLayouts, slotConfigs } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const configs = await db.select().from(slotConfigs);

	const defaultSlots = configs.map((config) => ({
		slotId: config.id,
		visible: config.defaultVisible,
		order: config.defaultOrder,
		pinned: false,
	}));

	const existingLayout = await db
		.select()
		.from(slotLayouts)
		.where(
			and(
				eq(slotLayouts.userId, userId),
				projectContext ? eq(slotLayouts.projectContext, projectContext) : undefined,
			),
		)
		.limit(1);

	let layout;

	if (existingLayout.length === 0) {
		layout = await db
			.insert(slotLayouts)
			.values({
				userId,
				projectContext,
				slots: defaultSlots,
			})
			.returning();
	} else {
		layout = await db
			.update(slotLayouts)
			.set({
				slots: defaultSlots,
				updatedAt: new Date(),
			})
			.where(eq(slotLayouts.id, existingLayout[0].id))
			.returning();
	}

	return layout[0];
});
