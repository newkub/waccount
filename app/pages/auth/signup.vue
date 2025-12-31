<script setup lang="ts">
import type { RegisterFormData } from "#shared/types/auth";
import { getUserHandle } from "#shared/utils/user-handle";
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: false,
});

const route = useRoute();
const {
	signUp,
	signInWithOAuth,
	startAuthKit,
	loading,
	error,
	success,
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

const onSubmit = async (formData: RegisterFormData) => {
	clearMessages();
	localError.value = null;

	const result = await signUp(formData);
	if (result) {
		await navigateTo(redirect.value);
	}
};

const onSignUpWithAuthKit = async () => {
	clearMessages();
	await startAuthKit();
};

const onSignUpWithProvider = async (provider: "google" | "github") => {
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
				v-if="success"
				type="success"
				:message="success"
				@close="clearMessages()"
			/>
			<UiAlert
				v-if="displayError"
				type="error"
				:message="displayError"
				@close="localError = null"
			/>

			<div class="text-center space-y-2">
				<h1 class="text-3xl font-bold text-gray-900">Create your account</h1>
				<p class="text-gray-600">Get started in a minute.</p>
			</div>

			<UiCard>
				<AuthProviders
					@authKit="onSignUpWithAuthKit"
					@provider="onSignUpWithProvider"
				/>
				<AuthSignupForm @submit="onSubmit" />
			</UiCard>
		</div>
	</LayoutAuthShell>
</template>
