export default defineEventHandler(async (event) => {
	const user = event.context.user as any;
	const { projectContext } = getQuery(event);

	if (!user?.id) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const db = await useDatabase();
	const { slotLayouts, slotConfigs } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const layout = await db
		.select()
		.from(slotLayouts)
		.where(
			and(
				eq(slotLayouts.userId, user.id),
				projectContext ? eq(slotLayouts.projectContext, projectContext as string) : undefined,
			),
		)
		.limit(1);

	if (layout.length === 0) {
		const configs = await db.select().from(slotConfigs);

		return {
			slots: configs.map((config) => ({
				slotId: config.id,
				visible: config.defaultVisible,
				order: config.defaultOrder,
				pinned: false,
			})),
			configs,
		};
	}

	const configs = await db.select().from(slotConfigs);

	return {
		slots: layout[0].slots,
		configs,
	};
});
