export default defineEventHandler(async (_event) => {
	const db = await useDatabase();
	const { slotConfigs } = await import("~/server/db/schema");

	const configs = await db.select().from(slotConfigs);

	return configs;
});
