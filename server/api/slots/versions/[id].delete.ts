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

	await db.delete(slotVersions).where(eq(slotVersions.id, versionId));

	return { success: true };
});
