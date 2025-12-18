import type { UserProfile, UpdateProfileData, Activity } from '~/shared/types';

export const useUserManagement = () => {
    const profile = useState<UserProfile | null>('profile', () => null);
    const loading = ref(false);
    const updating = ref(false);
    const error = ref<string | null>(null);
    const success = ref<string | null>(null);

    const apiHandler = useApiHandler(loading, error, success);
    const updatingApiHandler = useApiHandler(updating, error, success);

    const clearMessages = () => {
        error.value = null;
        success.value = null;
    };

    const fetchUserProfile = async (userId?: string) => {
        const endpoint = userId ? `/api/users/${userId}` : '/api/auth/workos/profile';
        const { data, error: fetchError } = await useAsyncData(
            `user-profile-${userId || 'me'}`,
            () => $fetch<{ profile?: UserProfile; user?: UserProfile }>(endpoint),
            { lazy: true, server: false }
        );

        if (fetchError.value) {
            error.value = fetchError.value?.message || 'Failed to fetch profile';
            return null;
        }

        const userProfile = data.value?.profile || data.value?.user || null;
        profile.value = userProfile;
        return userProfile;
    };

    const updateUserProfile = (data: UpdateProfileData) =>
        updatingApiHandler.handle(
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
        return updatingApiHandler.handle(
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
        apiHandler.handle(
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
        apiHandler.handle(
            () => $fetch<{ activities: Activity[] }>('/api/auth/workos/activities'),
            { errorMessage: 'Failed to fetch activities' }
        );

    const updateEmail = (newEmail: string) =>
        updatingApiHandler.handle(
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
        error: readonly(error),
        success: readonly(success),
        fetchUserProfile,
        updateUserProfile,
        uploadUserAvatar,
        deleteAccount,
        getUserActivities,
        updateEmail,
        clearMessages,
    };
};
