export const usePageAlerts = () => {
	const successMessage = ref("");
	const errorMessage = ref("");

	const handleSuccess = (message: string) => {
		successMessage.value = message;
		setTimeout(() => (successMessage.value = ""), 5000);
	};

	const handleError = (message: string) => {
		errorMessage.value = message;
		setTimeout(() => (errorMessage.value = ""), 5000);
	};

	return {
		successMessage,
		errorMessage,
		handleSuccess,
		handleError,
	};
};
