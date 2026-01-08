export default defineEventHandler(async (event) => {
	const templateId = getRouterParam(event, "id");

	if (!templateId) {
		throw createError({
			statusCode: 400,
			statusMessage: "templateId is required",
		});
	}

	const db = await useDatabase();
	const { slotTemplates } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	await db.delete(slotTemplates).where(eq(slotTemplates.id, templateId));

	return { success: true };
});
