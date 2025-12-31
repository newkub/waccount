import type { LoginFormData } from "#shared/types";

export function useLoginForm() {
	const { signInWithPassword, loading, error, clearMessages } = useAuth();

	const form = reactive<LoginFormData>({
		email: "",
		password: "",
	});

	const submit = () => {
		clearMessages();
		return signInWithPassword(form);
	};

	// Clear any previous auth errors when the form is mounted
	onMounted(clearMessages);

	// Also clear on unmount to prevent stale errors on other pages
	onUnmounted(clearMessages);

	return {
		form,
		submit,
		loading,
		error,
	};
}
