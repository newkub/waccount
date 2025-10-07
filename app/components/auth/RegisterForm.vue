<script setup lang="ts">
import { Schema } from "effect";
import { RegisterFormData, type ValidationError } from "~/types";

interface Props {
	redirectTo?: string;
	showSignInLink?: boolean;
	title?: string;
	subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
	redirectTo: '/auth/login?message=Registration successful. Please sign in.',
	showSignInLink: true,
	title: 'Create Account',
	subtitle: 'Sign up for a new account',
});

const { signUp, loading, error, success, clearMessages } = useAuth();

// Form data with proper type from Effect Schema
const form = reactive({
	email: '',
	password: '',
	confirmPassword: '',
	firstName: '',
	lastName: '',
});

const emit = defineEmits<{
	success: [];
	error: [error: string];
}>();

const passwordMismatch = ref(false);
const localError = ref<string | null>(null);
const validationErrors = ref<ValidationError[]>([]);

// Computed error ที่รวม error จาก useAuth และ local validation
const displayError = computed(() => {
	if (validationErrors.value.length > 0) {
		return validationErrors.value.map(e => `${e.field}: ${e.message}`).join(', ');
	}
	return localError.value || error.value;
});

/**
 * Validate form using Effect Schema
 * Returns true if valid, false otherwise
 */
const validateForm = (): boolean => {
	validationErrors.value = [];
	localError.value = null;
	passwordMismatch.value = false;

	// Validate with Effect Schema
	const result = Schema.decodeUnknownEither(RegisterFormData)(form);

	if (result._tag === "Left") {
		// Schema validation failed
		const error = result.left;
		localError.value = String(error);
		return false;
	}

	// Additional password confirmation check
	if (form.password !== form.confirmPassword) {
		passwordMismatch.value = true;
		localError.value = "Passwords do not match";
		return false;
	}

	return true;
};

const handleSubmit = async () => {
	// Clear previous errors
	clearMessages();

	// Validate form with Effect Schema
	if (!validateForm()) {
		return;
	}

	try {
		await signUp(form.email, form.password, {
			firstName: form.firstName,
			lastName: form.lastName,
		});
		emit('success');
		await navigateTo(props.redirectTo);
	} catch (err: any) {
		emit('error', err?.message || 'Registration failed');
		// Error is handled by useAuth composable
	}
};

// Watch for password changes to clear mismatch error
watch(() => form.confirmPassword, () => {
	if (passwordMismatch.value) {
		passwordMismatch.value = false;
		localError.value = null;
	}
});

// Real-time validation for email
watch(() => form.email, () => {
	if (form.email && validationErrors.value.length > 0) {
		validateForm();
	}
});
</script>

<template>
	<div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-primary-100">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
			<p class="text-gray-600">{{ subtitle }}</p>
		</div>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
						First Name
					</label>
					<input
						id="firstName"
						v-model="form.firstName"
						type="text"
						required
						:disabled="loading"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
						placeholder="John"
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
						Last Name
					</label>
					<input
						id="lastName"
						v-model="form.lastName"
						type="text"
						required
						:disabled="loading"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
						placeholder="Doe"
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
					Email Address
				</label>
				<input
					id="email"
					v-model="form.email"
					type="email"
					required
					:disabled="loading"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="john@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
					Password
				</label>
				<input
					id="password"
					v-model="form.password"
					type="password"
					required
					minlength="8"
					:disabled="loading"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Minimum 8 characters"
				/>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					v-model="form.confirmPassword"
					type="password"
					required
					minlength="8"
					:disabled="loading"
					:class="[
						'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed',
						passwordMismatch ? 'border-red-300' : 'border-gray-300'
					]"
					placeholder="Confirm your password"
				/>
				<p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
					Passwords do not match
				</p>
			</div>

			<button
				type="submit"
				:disabled="loading || !form.email || !form.password || !form.firstName || !form.lastName || !form.confirmPassword"
				class="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2"></i>
				{{ loading ? "Creating account..." : "Create Account" }}
			</button>
		</form>

		<div v-if="displayError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-center">
				<i class="i-mdi-alert-circle text-red-500 mr-2"></i>
				<p class="text-red-700 text-sm">{{ displayError }}</p>
				<button
					@click="() => { localError = null; clearMessages(); }"
					class="ml-auto text-red-400 hover:text-red-600"
				>
					<i class="i-mdi-close"></i>
				</button>
			</div>
		</div>

		<div v-if="success" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
			<div class="flex items-center">
				<i class="i-mdi-check-circle text-green-500 mr-2"></i>
				<p class="text-green-700 text-sm">{{ success }}</p>
				<button
					@click="clearMessages"
					class="ml-auto text-green-400 hover:text-green-600"
				>
					<i class="i-mdi-close"></i>
				</button>
			</div>
		</div>

		<div v-if="showSignInLink" class="mt-6 text-center">
			<p class="text-gray-600">
				Already have an account?
				<NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
					Sign in
				</NuxtLink>
			</p>
		</div>
	</div>
</template>
