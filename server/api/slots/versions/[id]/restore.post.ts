export default defineEventHandler(async (event) => {
	const versionId = getRouterParam(event, "id");

	if (!versionId) {
		throw createError({
			statusCode: 400,
			statusMessage: "versionId is required",
		});
	}

	const db = await useDatabase();
	const { slotVersions } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const version = await db
		.select()
		.from(slotVersions)
		.where(eq(slotVersions.id, versionId))
		.limit(1);

	if (version.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: "Version not found",
		});
	}

	return { slots: version[0].slots };
});
