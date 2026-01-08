export default defineEventHandler(async (event) => {
	const { category } = getQuery(event);

	const db = await useDatabase();
	const { slotTemplates } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	let templates;

	if (category) {
		templates = await db
			.select()
			.from(slotTemplates)
			.where(eq(slotTemplates.category, category as string));
	} else {
		templates = await db.select().from(slotTemplates);
	}

	return templates;
});
