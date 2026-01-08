export default defineEventHandler(async (event) => {
	const user = event.context.user as any;
	const body = await readBody(event);
	const { projectContext, slots } = body;

	if (!user?.id || !slots) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId and slots are required",
		});
	}

	const db = await useDatabase();
	const { slotLayouts } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const existingLayout = await db
		.select()
		.from(slotLayouts)
		.where(
			and(
				eq(slotLayouts.userId, user.id),
				projectContext ? eq(slotLayouts.projectContext, projectContext) : undefined,
			),
		)
		.limit(1);

	let layout;

	if (existingLayout.length === 0) {
		layout = await db
			.insert(slotLayouts)
			.values({
				userId: user.id,
				projectContext,
				slots,
			})
			.returning();
	} else {
		layout = await db
			.update(slotLayouts)
			.set({
				slots,
				updatedAt: new Date(),
			})
			.where(eq(slotLayouts.id, existingLayout[0].id))
			.returning();
	}

	return layout[0];
});
