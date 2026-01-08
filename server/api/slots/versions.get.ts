export default defineEventHandler(async (event) => {
	const { layoutId } = getQuery(event);

	if (!layoutId) {
		throw createError({
			statusCode: 400,
			statusMessage: "layoutId is required",
		});
	}

	const db = await useDatabase();
	const { slotVersions } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const versions = await db
		.select()
		.from(slotVersions)
		.where(eq(slotVersions.layoutId, layoutId as string))
		.orderBy(slotVersions.version);

	return versions;
});
