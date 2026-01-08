export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, projectContext, slots } = body;

	if (!userId || !slots) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId and slots are required",
		});
	}

	const db = await useDatabase();
	const { slotLayouts, slotVersions } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

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

	let layoutId: string;

	if (existingLayout.length === 0) {
		const newLayout = await db
			.insert(slotLayouts)
			.values({
				userId,
				projectContext,
				slots,
			})
			.returning();
		layoutId = newLayout[0].id;
	} else {
		layoutId = existingLayout[0].id;

		const maxVersion = await db
			.select({ version: slotVersions.version })
			.from(slotVersions)
			.where(eq(slotVersions.layoutId, layoutId))
			.orderBy(slotVersions.version)
			.limit(1);

		const nextVersion = maxVersion.length > 0 ? maxVersion[0].version + 1 : 1;

		await db.insert(slotVersions).values({
			layoutId,
			userId,
			version: nextVersion,
			slots: existingLayout[0].slots,
		});

		await db
			.update(slotLayouts)
			.set({
				slots,
				updatedAt: new Date(),
			})
			.where(eq(slotLayouts.id, layoutId));
	}

	const updatedLayout = await db
		.select()
		.from(slotLayouts)
		.where(eq(slotLayouts.id, layoutId))
		.limit(1);

	return updatedLayout[0];
});
