export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { name, description, category, slots, isDefault } = body;

	if (!name || !slots) {
		throw createError({
			statusCode: 400,
			statusMessage: "name and slots are required",
		});
	}

	const db = await useDatabase();
	const { slotTemplates } = await import("~/server/db/schema");

	const template = await db
		.insert(slotTemplates)
		.values({
			name,
			description,
			category,
			slots,
			isDefault: isDefault || false,
		})
		.returning();

	return template[0];
});
