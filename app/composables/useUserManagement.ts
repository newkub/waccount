import type { UserProfile, UpdateProfileData, Activity } from '../../shared/types';

export const useUserManagement = () => {
    const profile = useState<UserProfile | null>('profile', () => null);
        const loading = ref(false);
    const updating = ref(false);

    const apiHandler = useApiHandler(loading);
    const updatingApiHandler = useApiHandler(updating);

    
        const fetchUserProfile = (userId?: string) => {
        const endpoint = userId ? `/api/users/${userId}` : '/api/auth/workos/profile';
                return apiHandler.handle<{ profile?: UserProfile; user?: UserProfile }>(
            () => $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint),
            {
                errorMessage: 'Failed to fetch profile',
                onSuccess: (result) => {
                    const userProfile = result?.profile || result?.user || null;
                    profile.value = userProfile;
                },
            }
        );
    };

        const updateUserProfile = (data: UpdateProfileData) =>
        updatingApiHandler.handle<{ profile: UserProfile }>(
            () => $fetch<{ profile: UserProfile }>('/api/auth/workos/profile', { method: 'PATCH', body: data }),
            {
                successMessage: 'Profile updated successfully',
                errorMessage: 'Failed to update profile',
                onSuccess: (result: { profile: UserProfile } | null) => {
                    if (result) profile.value = result.profile;
                },
            }
        );

    const uploadUserAvatar = (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
                return updatingApiHandler.handle<{ avatarUrl: string }>(
            () => $fetch<{ avatarUrl: string }>('/api/auth/workos/profile/avatar', { method: 'POST', body: formData }),
            {
                successMessage: 'Profile picture uploaded successfully',
                errorMessage: 'Failed to upload profile picture',
                onSuccess: (result: { avatarUrl: string } | null) => {
                    if (result && profile.value) {
                        profile.value.avatar = result.avatarUrl;
                    }
                },
            }
        );
    };

        const deleteAccount = () =>
        apiHandler.handle<{ success: boolean }>(
            () => $fetch('/api/auth/workos/account', { method: 'DELETE' }),
            {
                successMessage: 'Account deleted successfully',
                errorMessage: 'Failed to delete account',
                onSuccess: async () => {
                    profile.value = null;
                    await navigateTo('/');
                },
            }
        );

    const getUserActivities = () =>
        apiHandler.handle<{ activities: Activity[] }>(
            () => $fetch<{ activities: Activity[] }>('/api/auth/workos/activities'),
            { errorMessage: 'Failed to fetch activities' }
        );

            const resendVerificationEmail = () =>
        apiHandler.handle(
            () => $fetch('/api/auth/workos/verify-email', { method: 'POST' }),
            {
                successMessage: 'Verification email has been sent.',
                errorMessage: 'Failed to send verification email.',
            }
        );

    const updateEmail = (newEmail: string) =>
        updatingApiHandler.handle<{ success: boolean }>(
            () => $fetch('/api/auth/workos/email', { method: 'PATCH', body: { email: newEmail } }),
            {
                successMessage: 'Email update request sent. Please check your new email for verification.',
                errorMessage: 'Failed to update email',
            }
        );

        return {
        profile: readonly(profile),
        loading: readonly(loading),
        updating: readonly(updating),
        fetchUserProfile,
        updateUserProfile,
        uploadUserAvatar,
        deleteAccount,
        getUserActivities,
                updateEmail,
        resendVerificationEmail,
    };
};
