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
			login: "mdi:login-variant",
			"user.signed_out": "mdi:logout-variant",
			"user.created": "mdi:account-plus-outline",
			"user.updated": "mdi:account-edit-outline",
			"email.verified": "mdi:email-check-outline",
			"password.updated": "mdi:lock-reset",
			password: "mdi:lock-reset",
		};
		return iconMap[type] || "mdi:information-outline";
	};

	const getActivityColor = (type: string, success: boolean) => {
		if (!success) {
			return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
		}
		const colorMap: Record<string, string> = {
			login: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
			password: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
			profile: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
			organization: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
			security: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
			connection: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
		};
		return colorMap[type] || "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
	};

	return {
		getActivityIcon,
		getActivityColor,
	};
};
