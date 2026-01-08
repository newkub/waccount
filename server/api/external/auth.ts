export default defineEventHandler(async (event) => {
	const { apiKey } = getHeader(event, "x-api-key") || {};

	if (!apiKey) {
		throw createError({
			statusCode: 401,
			statusMessage: "API key is required",
		});
	}

	const db = await useDatabase();
	const { users } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	const user = await db.select().from(users).where(eq(users.email, apiKey as string)).limit(1);

	if (user.length === 0) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid API key",
		});
	}

	event.context.user = user[0];
});
