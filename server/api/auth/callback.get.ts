import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { users } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
	const workos = createWorkos(event);
	const { code } = getQuery(event);

	if (!code || typeof code !== "string") {
		throw createError({
			statusCode: 400,
			message: "Missing authorization code",
		});
	}

	const { user: workosUser } = await workos.userManagement.authenticateWithCode({
		code,
		clientId: useRuntimeConfig(event).public.workosClientId,
	});

	let user = await db.query.users.findFirst({
		where: eq(users.id, workosUser.id),
	});

	if (!user) {
		user = (await db.insert(users).values({
			id: workosUser.id,
			email: workosUser.email,
			name: workosUser.firstName ? `${workosUser.firstName} ${workosUser.lastName || ""}`.trim() : null,
			avatarUrl: workosUser.profilePictureUrl,
		}).returning())[0];
	}

	if (!user) {
		throw createError({
			statusCode: 500,
			message: "Failed to create user",
		});
	}

	const session = await lucia.createSession(user.id, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());

	return sendRedirect(event, "/me");
});
