export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, projectContext, templateId } = body;

	if (!userId || !templateId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId and templateId are required",
		});
	}

	const db = await useDatabase();
	const { slotLayouts, slotTemplates } = await import("~/server/db/schema");
	const { eq, and } = await import("drizzle-orm");

	const template = await db
		.select()
		.from(slotTemplates)
		.where(eq(slotTemplates.id, templateId))
		.limit(1);

	if (template.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: "Template not found",
		});
	}

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
				slots: template[0].slots,
			})
			.returning();
	} else {
		layout = await db
			.update(slotLayouts)
			.set({
				slots: template[0].slots,
				updatedAt: new Date(),
			})
			.where(eq(slotLayouts.id, existingLayout[0].id))
			.returning();
	}

	return layout[0];
});
