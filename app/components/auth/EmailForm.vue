<script setup lang="ts">
interface Props {
	mode: "signin" | "signup";
	loading: boolean;
	error: string | null;
	success: string | null;
}

defineProps<Props>();

interface Emits {
	(e: "submit"): void;
}

const emit = defineEmits<Emits>();

const form = defineModel<{
	email: string;
	password: string;
}>("form", { required: true });

const showPassword = ref(false);

const { generatePassword: handleGeneratePassword, generatedPassword } = useGeneratePasswordFacade();

const generatePassword = () => {
	handleGeneratePassword();
	form.value.password = generatedPassword.value;
};

const handleSubmit = () => {
	emit("submit");
};
</script>

<template>
	<form @submit.prevent="handleSubmit" class="space-y-6">
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700 mb-1"
			>Email</label>
			<input
				id="email"
				v-model="form.email"
				type="email"
				autocomplete="email"
				required
				placeholder="example@email.com"
				class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
			/>
		</div>

		<div>
			<div class="flex items-center justify-between mb-1">
				<label for="password" class="block text-sm font-medium text-gray-700"
				>Password</label>
				<div class="flex items-center gap-2">
					<div v-if="mode === 'signup'">
						<button
							type="button"
							@click="handleGeneratePassword"
							class="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
							title="Generate password"
						>
							Generate
						</button>
					</div>
					<div v-if="mode === 'signin'">
						<NuxtLink
							to="/auth/reset-password"
							class="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
						>
							Forgot?
						</NuxtLink>
					</div>
				</div>
			</div>
			<div class="relative">
				<input
					id="password"
					v-model="form.password"
					:type="showPassword ? 'text' : 'password'"
					:autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
					required
					placeholder="••••••••"
					class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
				/>
				<button
					type="button"
					@click="showPassword = !showPassword"
					class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					title="Toggle password visibility"
				>
					<svg
						v-if="!showPassword"
						class="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
							fill="currentColor"
						/>
					</svg>
					<svg
						v-else
						class="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11.83 9L15.29 12.46c.04-.32.07-.64.07-.96 0-1.66-1.34-3-3-3-.32 0-.64.03-.96.07L11.83 9zm7.08-2.32c2.33 2.26 3.68 5.7 2.25 9.32-1.73 4.39-6 7.5-11.16 7.5-1.52 0-2.93-.29-4.26-.84l3.15-3.15c.57.29 1.25.46 1.96.46 2.76 0 5-2.24 5-5 0-.71-.17-1.39-.46-1.96l2.52-2.52zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 2.04 0 3.71-.5 5.25-1.3L19.73 21 21 19.73 3.27 2 2 4.27zM7.53 9.8l1.55 1.55c-.05-.21-.08-.43-.08-.65 0-1.66 1.34-3 3-3 .22 0 .44.03.65.08l1.55-1.55c-.67-.33-1.41-.53-2.2-.53-2.76 0-5 2.24-5 5 0 .79.2 1.53.53 2.15z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
			<p class="text-sm text-red-600">{{ error }}</p>
		</div>

		<div
			v-if="success"
			class="p-3 bg-green-50 border border-green-200 rounded-lg"
		>
			<p class="text-sm text-green-600">{{ success }}</p>
		</div>

		<button
			type="submit"
			:disabled="loading"
			class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{{ loading ? "Loading..." : (mode === "signin" ? "Sign In" : "Sign Up") }}
		</button>
	</form>
</template>
