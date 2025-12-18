export type UserProfile = User;

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	avatar?: string;
}

export interface User {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	emailVerified: boolean;
	avatar: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Activity {
	id: string;
	type: string;
	timestamp: string;
	[key: string]: unknown;
}
