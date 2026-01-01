import { defineStore } from "pinia";

export const usePageAlertsStore = defineStore("pageAlerts", () => {
	const successMessage = ref("");
	const errorMessage = ref("");

	const setSuccessMessage = (message: string, duration = 5000) => {
		successMessage.value = message;
		if (duration > 0) {
			setTimeout(() => (successMessage.value = ""), duration);
		}
	};

	const setErrorMessage = (message: string, duration = 5000) => {
		errorMessage.value = message;
		if (duration > 0) {
			setTimeout(() => (errorMessage.value = ""), duration);
		}
	};

	return {
		successMessage,
		errorMessage,
		setSuccessMessage,
		setErrorMessage,
	};
});
