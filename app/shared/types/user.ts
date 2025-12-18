export type UserProfile = User;

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	profilePictureUrl?: string;
}

export interface User {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	emailVerified: boolean;
	profilePictureUrl: string | null;
	createdAt: string;
	updatedAt: string;
}
