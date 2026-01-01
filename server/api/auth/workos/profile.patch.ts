import { createError, defineEventHandler, readBody } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";
import { mapWorkosUserToAppUser } from "../../../utils/workos-user";
import { UserPreferencesSchema } from "../../../../shared/schemas";
import type { UserPreferences } from "#shared/types";

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);

	const body = await readBody<{ firstName?: string; lastName?: string; preferences?: UserPreferences }>(event);
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: "No body provided",
		});
	}

	const { workos } = getWorkosAuthkitConfig();

	const unsafeMetadata = {
		...user.unsafeMetadata,
		preferences: {
			...(user.unsafeMetadata?.preferences as object),
			...UserPreferencesSchema.partial().parse(body.preferences ?? {}),
		},
	};

	const updated = await workos.userManagement.updateUser({
		userId: user.id,
		firstName: body.firstName,
		lastName: body.lastName,
		unsafeMetadata,
	});

	return { profile: mapWorkosUserToAppUser(updated) };
});
