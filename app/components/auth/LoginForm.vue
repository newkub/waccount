<script setup lang="ts">
import type { LoginFormData } from '~/types';

interface Props {
	redirectTo?: string;
	showSignUpLink?: boolean;
	title?: string;
	subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
	redirectTo: '/profile',
	showSignUpLink: true,
	title: 'Welcome Back',
	subtitle: 'Sign in to your account',
});

const { signInWithPassword, loading, error, clearMessages } = useAuth();

const form = reactive<LoginFormData>({
	email: '',
	password: '',
});

const emit = defineEmits<{
	success: [];
	error: [error: string];
}>();

const handleSubmit = async () => {
	try {
		await signInWithPassword(form.email, form.password);
		emit('success');
		// Navigation handled by signInWithPassword
	} catch (err: any) {
		emit('error', err?.message || 'Login failed');
	}
};
</script>

<template>
	<div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-primary-100">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
			<p class="text-gray-600">{{ subtitle }}</p>
		</div>

		<form @submit.prevent="handleSubmit" class="space-y-6">
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
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Enter your email"
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
					:disabled="loading"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Enter your password"
				/>
			</div>

			<button
				type="submit"
				:disabled="loading || !form.email || !form.password"
				class="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2"></i>
				{{ loading ? "Signing in..." : "Sign In" }}
			</button>
		</form>

		<div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-center">
				<i class="i-mdi-alert-circle text-red-500 mr-2"></i>
				<p class="text-red-700 text-sm">{{ error }}</p>
				<button
					@click="clearMessages"
					class="ml-auto text-red-400 hover:text-red-600"
				>
					<i class="i-mdi-close"></i>
				</button>
			</div>
		</div>

		<div v-if="showSignUpLink" class="mt-6 text-center">
			<p class="text-gray-600">
				Don't have an account?
				<NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
					Sign up
				</NuxtLink>
			</p>
		</div>
	</div>
</template>
