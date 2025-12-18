import type { UpdateProfileData } from '~/shared/types';

export const useProfilePage = () => {
    const { user, refreshUser, resendVerificationEmail } = useAuth();
    const {
        updateUserProfile,
        uploadUserAvatar,
        getUserActivities,
        error,
        success,
        clearMessages,
        loading,
    } = useUserManagement();

    const { data: activities, pending: activitiesLoading } = useAsyncData(
        'user-activities',
        () => getUserActivities(),
        { lazy: true }
    );

    const handleUpdateProfile = async (updateData: UpdateProfileData) => {
        if (!user.value) return;
        await updateUserProfile(updateData);
        await refreshUser(); // Refresh main user state
    };

    const handleUploadAvatar = async (file: File) => {
        if (!user.value) return;
        await uploadUserAvatar(file);
        await refreshUser(); // Refresh main user state
    };

    const handleResendVerification = async () => {
        if (!user.value) return;
        await resendVerificationEmail();
    };

    return {
        user,
        activities,
        activitiesLoading,
        error,
        success,
        loading,
        clearMessages,
        handleUpdateProfile,
        handleUploadAvatar,
        handleResendVerification,
    };
};
