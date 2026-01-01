import type { Activity, UpdateProfileData, UserProfile } from '#shared/types';

export const useUserService = () => {
	const fetchUserProfile = (userId?: string) => {
		const endpoint = userId ? `/api/users/${userId}` : '/api/auth/workos/profile';
		return $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint);
	};

	const updateUserProfile = (data: UpdateProfileData) => {
		return $fetch<{ profile: UserProfile }>('/api/auth/workos/profile', {
			method: 'PATCH',
			body: data,
		});
	};

	const uploadUserAvatar = (file: File) => {
		const formData = new FormData();
		formData.append('avatar', file);
		return $fetch<{ avatarUrl: string }>('/api/auth/workos/profile/avatar', {
			method: 'POST',
			body: formData,
		});
	};

	const deleteAccount = () => {
		return $fetch('/api/auth/workos/account', { method: 'DELETE' });
	};

	const getUserActivities = () => {
		return $fetch<{ activities: Activity[] }>('/api/auth/workos/activities');
	};

	const resendVerificationEmail = () => {
		return $fetch('/api/auth/workos/verify-email', { method: 'POST' });
	};

	const updateEmail = (newEmail: string) => {
		return $fetch('/api/auth/workos/email', {
			method: 'PATCH',
			body: { email: newEmail },
		});
	};

	return {
		fetchUserProfile,
		updateUserProfile,
		uploadUserAvatar,
		deleteAccount,
		getUserActivities,
		resendVerificationEmail,
		updateEmail,
	};
};
