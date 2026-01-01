import type { User } from "#shared/types";
import { UserPreferencesSchema } from "../../shared/schemas";

export const mapWorkosUserToAppUser = (user: {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	emailVerified: boolean;
	profilePictureUrl?: string | null;
	createdAt: string;
	updatedAt: string;
	unsafeMetadata?: Record<string, any>;
}): User => {
	const preferences = UserPreferencesSchema.optional()
		.nullable()
		.parse(user.unsafeMetadata?.preferences ?? null);

	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName ?? null,
		lastName: user.lastName ?? null,
		emailVerified: user.emailVerified,
		avatar: user.profilePictureUrl ?? null,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		preferences,
	};
};
