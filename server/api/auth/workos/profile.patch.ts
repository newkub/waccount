import type { UserPreferences } from "#shared/types";
import { createError, defineEventHandler, readBody } from "h3";
import { UserPreferencesSchema } from "../../../../shared/schemas";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);

	const body = await readBody<{ firstName?: string; lastName?: string; preferences?: UserPreferences }>(event);
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: "No body provided",
		});
	}

	const workos = createWorkos(event);

	const metadata = {
		...(user as any).metadata,
		preferences: {
			...((user as any).metadata?.preferences as object),
			...UserPreferencesSchema.partial().parse(body.preferences ?? {}),
		},
	};

	const updated = await workos.userManagement.updateUser({
		userId: user.id,
		firstName: body.firstName,
		lastName: body.lastName,
		metadata,
	});

	return { profile: mapWorkosUserToAppUser(updated) };
});
