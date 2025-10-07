<script setup lang="ts">
import type { LoginFormData } from "~/types";

interface Props {
	redirectTo?: string;
	showSignUpLink?: boolean;
	title?: string;
	subtitle?: string;
	noWrapper?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	redirectTo: "/profile",
	showSignUpLink: true,
	title: "Welcome Back",
	subtitle: "Sign in to your account",
	noWrapper: false,
});

const { signInWithPassword, loading, error, clearMessages } = useAuth();

const form = reactive<LoginFormData>({
	email: "",
	password: "",
});

const emit = defineEmits<{
	success: [];
	error: [error: string];
}>();

const _handleSubmit = async () => {
	try {
		await signInWithPassword(form.email, form.password);
		emit("success");
		// Navigation handled by signInWithPassword
	} catch (err: any) {
		emit("error", err?.message || "Login failed");
	}
};

const handleSubmit = _handleSubmit;
</script>

<template>
	<div v-if="!noWrapper" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 max-w-md mx-auto">
		<div v-if="title || subtitle" class="text-center mb-8">
			<h1 v-if="title" class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
			<p v-if="subtitle" class="text-gray-600">{{ subtitle }}</p>
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
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
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
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Enter your password"
				/>
			</div>

			<button
				type="submit"
				:disabled="loading || !form.email || !form.password"
				class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{{ loading ? "Signing in..." : "Sign In" }}
			</button>
		</form>

		<div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-center">
				<p class="text-red-700 text-sm">{{ error }}</p>
				<button
					@click="clearMessages"
					class="ml-auto text-red-400 hover:text-red-600"
				>
					✕
				</button>
			</div>
		</div>

		<div v-if="showSignUpLink" class="mt-6 text-center">
			<p class="text-gray-600">
				Don't have an account?
				<NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-medium">
					Sign up
				</NuxtLink>
			</p>
		</div>
	</div>

	<!-- No wrapper version for tabs -->
	<div v-else>
		<form @submit.prevent="handleSubmit" class="space-y-6">
			<div>
				<label for="email-tab" class="block text-sm font-medium text-gray-700 mb-2">
					Email Address
				</label>
				<input
					id="email-tab"
					v-model="form.email"
					type="email"
					required
					:disabled="loading"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Enter your email"
				/>
			</div>

			<div>
				<label for="password-tab" class="block text-sm font-medium text-gray-700 mb-2">
					Password
				</label>
				<input
					id="password-tab"
					v-model="form.password"
					type="password"
					required
					:disabled="loading"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
					placeholder="Enter your password"
				/>
			</div>

			<button
				type="submit"
				:disabled="loading || !form.email || !form.password"
				class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{{ loading ? "Signing in..." : "Sign In" }}
			</button>
		</form>

		<div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-center">
				<p class="text-red-700 text-sm">{{ error }}</p>
				<button
					@click="clearMessages"
					class="ml-auto text-red-400 hover:text-red-600"
				>
					✕
				</button>
			</div>
		</div>
	</div>
</template>
