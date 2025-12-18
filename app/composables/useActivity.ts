/**
 * @module useActivity
 * @description Composable for activity-related logic, such as mapping activity types to icons and colors.
 */
export const useActivity = () => {
    /**
     * Returns a specific icon class based on the activity type.
     * @param {string} type The activity type string.
     * @returns {string} The corresponding icon class.
     */
    const getActivityIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            'user.signed_in': 'i-mdi-login-variant',
            'user.signed_out': 'i-mdi-logout-variant',
            'user.created': 'i-mdi-account-plus-outline',
            'user.updated': 'i-mdi-account-edit-outline',
            'email.verified': 'i-mdi-email-check-outline',
            'password.updated': 'i-mdi-lock-reset',
        };
        return iconMap[type] || 'i-mdi-information-outline';
    };

    return {
        getActivityIcon,
    };
};
