import type { User } from "../../shared/types";
import { getWorkosAuthkitConfig } from "./authkit-session";

interface RegistrationData {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
}

export const mapWorkosUserToAppUser = (user: {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	emailVerified: boolean;
	profilePictureUrl?: string | null;
	createdAt: string;
	updatedAt: string;
}): User => {
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName ?? null,
		lastName: user.lastName ?? null,
		emailVerified: user.emailVerified,
		avatar: user.profilePictureUrl ?? null,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
};

export const registerAndAuthenticateUser = async (data: RegistrationData) => {
	const { workos, clientId, cookiePassword } = getWorkosAuthkitConfig();

	await workos.userManagement.createUser({
		email: data.email,
		password: data.password,
		firstName: data.firstName,
		lastName: data.lastName,
		emailVerified: false,
	});

	const authResponse = await workos.userManagement.authenticateWithPassword({
		clientId,
		email: data.email,
		password: data.password,
		session: {
			sealSession: true,
			cookiePassword,
		},
	});

	return authResponse;
};
