export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { layoutId, userId, slots } = body;

	if (!layoutId || !userId || !slots) {
		throw createError({
			statusCode: 400,
			statusMessage: "layoutId, userId, and slots are required",
		});
	}

	const db = await useDatabase();
	const { slotVersions } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const maxVersion = await db
		.select({ version: slotVersions.version })
		.from(slotVersions)
		.where(eq(slotVersions.layoutId, layoutId))
		.orderBy(slotVersions.version)
		.limit(1);

	const nextVersion = maxVersion.length > 0 ? maxVersion[0].version + 1 : 1;

	const version = await db
		.insert(slotVersions)
		.values({
			layoutId,
			userId,
			version: nextVersion,
			slots,
		})
		.returning();

	return version[0];
});
