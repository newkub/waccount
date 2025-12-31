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
			"user.signed_in": "mdi:login-variant",
			"user.signed_out": "mdi:logout-variant",
			"user.created": "mdi:account-plus-outline",
			"user.updated": "mdi:account-edit-outline",
			"email.verified": "mdi:email-check-outline",
			"password.updated": "mdi:lock-reset",
		};
		return iconMap[type] || "mdi:information-outline";
	};

	return {
		getActivityIcon,
	};
};
