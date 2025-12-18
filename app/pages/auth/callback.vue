<script setup lang="ts">
import type { User } from "~/app/shared/types";

useHead({
	title: "Authenticating - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});

const route = useRoute();
const router = useRouter();
const { setUser } = useAuth();

const code = computed(() => route.query.code as string);
const errorParam = computed(() => route.query.error as string);

const {
	data,
	pending: loading,
	error,
} = useAsyncData(
	"oauth-callback",
	async () => {
		if (errorParam.value) {
			throw createError({
				statusCode: 400,
				statusMessage: `Authentication failed: ${errorParam.value}`,
			});
		}
		if (!code.value) {
			throw createError({
				statusCode: 400,
				statusMessage: "No authorization code received",
			});
		}
		return $fetch<{
			user: User;
			accessToken: string;
			refreshToken?: string;
		}>("/api/auth/workos/callback", {
			query: { code: code.value },
		});
	},
	{
		immediate: true,
	},
);

watch(data, async (newData) => {
		if (newData) {
			setUser(newData.user);
			await router.push(`/${newData.user.id}/profile`);
		}
	},
	{ immediate: true },
);

const retry = () => {
	router.push("/auth/login");
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
		<div class="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-8">
			<!-- Loading State -->
			<div v-if="loading && !error" class="text-center">
				<div class="mb-6">
					<i class="i-mdi-loading animate-spin text-5xl text-primary-500"></i>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">
					Authenticating...
				</h2>
				<p class="text-gray-600">
					Please wait while we complete your sign-in
				</p>
				<div class="mt-6 flex justify-center">
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
						<div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
						<div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
					</div>
				</div>
			</div>

			<!-- Error State -->
			<div v-else-if="error" class="text-center">
				<div class="mb-6">
					<i class="i-mdi-alert-circle text-5xl text-red-500"></i>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">
					Authentication Failed
				</h2>
				<p class="text-gray-600 mb-6">{{ error }}</p>
				<button
					@click="retry"
					class="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
				>
					Return to Login
				</button>
			</div>
		</div>
	</div>
</template>
