<script setup lang="ts">
import type { LoginFormData } from "#shared/types/auth";
import { getUserHandle } from "#shared/utils/user-handle";
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: false,
});

const route = useRoute();
const {
	signInWithPassword,
	signInWithOAuth,
	startAuthKit,
	loading,
	error,
	clearMessages,
	user,
} = useAuth();

const redirect = computed(() => {
	const q = route.query.redirect;
	if (typeof q === "string" && q) return q;
	if (user.value) return `/${getUserHandle(user.value)}`;
	return "/";
});

const localError = ref<string | null>(null);
const displayError = computed(() => localError.value || error.value);

const onSubmit = async (formData: LoginFormData) => {
	clearMessages();
	localError.value = null;

	const result = await signInWithPassword(formData);
	if (result) {
		await navigateTo(redirect.value);
	}
};

const onSignInWithAuthKit = async () => {
	clearMessages();
	await startAuthKit();
};

const onSignInWithProvider = async (provider: "google" | "github") => {
	clearMessages();
	await signInWithOAuth(provider);
};

onBeforeUnmount(() => {
	clearMessages();
});
</script>

<template>
	<LayoutAuthShell>
		<div class="space-y-6">
			<UiAlert
				v-if="displayError"
				type="error"
				:message="displayError"
				@close="localError = null"
			/>

			<div class="text-center space-y-2">
				<h1 class="text-3xl font-bold text-gray-900">Sign in</h1>
				<p class="text-gray-600">
					Access your account and manage your settings.
				</p>
			</div>

			<UiCard>
				<AuthProviders
					@authKit="onSignInWithAuthKit"
					@provider="onSignInWithProvider"
				/>
				<AuthLoginForm @submit="onSubmit" />
			</UiCard>
		</div>
	</LayoutAuthShell>
</template>
