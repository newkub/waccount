export default defineEventHandler(async (event) => {
	const templateId = getRouterParam(event, "id");
	const body = await readBody(event);

	if (!templateId) {
		throw createError({
			statusCode: 400,
			statusMessage: "templateId is required",
		});
	}

	const db = await useDatabase();
	const { slotTemplates } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const template = await db
		.update(slotTemplates)
		.set({
			...body,
			updatedAt: new Date(),
		})
		.where(eq(slotTemplates.id, templateId))
		.returning();

	if (template.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: "Template not found",
		});
	}

	return template[0];
});
