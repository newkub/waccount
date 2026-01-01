import type { RegisterFormData, RegisterFormEmit } from "#shared/types";
import { useAuth } from "~/composables/facade/useAuth";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

export const useRegisterForm = (emit: RegisterFormEmit, redirectTo: string) => {
	const { signUp, loading, clearMessages } = useAuth();
	const authStore = useAuthStore();
	const { error, success } = storeToRefs(authStore);

	const form = reactive<RegisterFormData & { confirmPassword: string }>({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});

	const passwordMismatch = ref(false);
	const localError = ref<string | null>(null);

	const displayError = computed(() => {
		return localError.value || error.value;
	});

	const validateForm = (): boolean => {
		localError.value = null;
		passwordMismatch.value = false;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!form.email || !emailRegex.test(form.email)) {
			localError.value = "Invalid email address";
			return false;
		}

		if (!form.password || form.password.length < 8) {
			localError.value = "Password must be at least 8 characters";
			return false;
		}

		if (form.password !== form.confirmPassword) {
			passwordMismatch.value = true;
			localError.value = "Passwords do not match";
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		clearMessages();
		if (!validateForm()) {
			return;
		}

		try {
			const result = await signUp(form);
			if (result) {
				emit("success");
				await navigateTo(redirectTo);
			}
		} catch (err: unknown) {
			emit("error", (err as Error)?.message || "Registration failed");
		}
	};

	watch(
		() => form.confirmPassword,
		() => {
			if (passwordMismatch.value) {
				passwordMismatch.value = false;
				localError.value = null;
			}
		},
	);

	return {
		form,
		loading,
		success,
		displayError,
		passwordMismatch,
		handleSubmit,
		clearAllErrors: () => {
			localError.value = null;
			clearMessages();
		},
	};
};
