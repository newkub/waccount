import type { UpdateProfileData } from '~/shared/types';

export const useProfilePage = () => {
    const { user, refreshUser } = useAuth();
            const {
        updateUserProfile,
        uploadUserAvatar,
        getUserActivities,
        loading,
        resendVerificationEmail,
    } = useUserManagement();

        const { data: activities, pending: activitiesLoading } = useAsyncData(
        'user-activities',
        () => getUserActivities(),
        {
            lazy: true,
            // Transform the result to get the activities array directly
            transform: (response) => response?.activities || [],
        }
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
        // This now correctly calls the function from useUserManagement
        await resendVerificationEmail();
    };

        return {
        user,
        activities,
        activitiesLoading,
        loading,
        handleUpdateProfile,
        handleUploadAvatar,
        handleResendVerification,
    };
};
