import { computed, readonly, ref } from "vue";
import { useAuth } from "~/composables/facade/useAuth";

interface AuthForm {
	email: string;
	password: string;
}

interface AuthUIState {
	activeTab: "signin" | "signup";
	showEmailForm: boolean;
	form: AuthForm;
}

/**
 * Auth UI composable
 * - Manages auth UI state and interactions
 * - Provides computed properties for UI
 * - Handles tab switching and form toggling
 */
export const useAuthUI = (initialMode: "signin" | "signup" = "signin") => {
	const state = ref<AuthUIState>({
		activeTab: initialMode === "signup" ? "signup" : "signin",
		showEmailForm: false,
		form: {
			email: "",
			password: "",
		},
	});

	const {
		signInWithPassword,
		signUp,
		signInWithOAuth,
		loading,
		clearMessages,
	} = useAuth();

	// Computed properties
	const title = computed(() => {
		if (state.value.activeTab === "signin") return "Welcome Back";
		return "Create New Account";
	});

	const subtitle = computed(() => {
		if (state.value.activeTab === "signin") return "Sign in to access your account";
		return "Sign up to get started";
	});

	const isFormValid = computed(() => {
		return state.value.form.email && state.value.form.password.length >= 6;
	});

	// Actions
	const switchTab = (tab: "signin" | "signup") => {
		state.value.activeTab = tab;
		state.value.showEmailForm = false;
		clearMessages();
	};

	const toggleEmailForm = () => {
		state.value.showEmailForm = !state.value.showEmailForm;
		clearMessages();
	};

	const handleAuth = async () => {
		try {
			clearMessages();

			if (state.value.activeTab === "signup") {
				await signUp({ ...state.value.form, confirmPassword: state.value.form.password });
			} else {
				await signInWithPassword(state.value.form);
			}
		} catch (err: any) {
			// Error is handled by useAuth composable
			console.error("Auth error:", err);
		}
	};

	const handleSocialAuth = async (provider: "google" | "github" | "microsoft") => {
		try {
			await signInWithOAuth(provider);
		} catch (err: any) {
			// Error is handled by useAuth composable
			console.error("Social auth error:", err);
		}
	};

	const resetForm = () => {
		state.value.form = {
			email: "",
			password: "",
		};
		state.value.showEmailForm = false;
		clearMessages();
	};

	const setMode = (mode: "signin" | "signup") => {
		state.value.activeTab = mode;
	};

	// Create a writable ref for form
	const formRef = computed({
		get: () => state.value.form,
		set: (value) => {
			state.value.form = value;
		},
	});

	return {
		// State
		state: readonly(state),
		activeTab: computed(() => state.value.activeTab),
		showEmailForm: computed(() => state.value.showEmailForm),
		form: formRef,

		// Computed
		title,
		subtitle,
		isFormValid,

		// Auth state
		loading,

		// Actions
		switchTab,
		toggleEmailForm,
		handleAuth,
		handleSocialAuth,
		resetForm,
		setMode,

		// Direct auth methods
		signInWithPassword,
		signUp,
		signInWithOAuth,
		clearMessages,
	};
};
