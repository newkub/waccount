<script setup lang="ts">
import { useAuth } from "~/composables/auth";

definePageMeta({
	layout: false,
});

useHead({
	title: "Sign In - Account Wrikka",
});

const { signInWithPassword, signInWithProvider, loading, error, success, clearMessages } = useAuth();

const onSubmit = async (formData: { email: any; password: any }) => {
	clearMessages();
	await signInWithPassword(formData.email, formData.password);
	if (!error.value) {
		await navigateTo("/account");
	}
};

const onSignInWithProvider = async (provider: "google" | "github" | "microsoft") => {
	clearMessages();
	await signInWithProvider(provider);
};

onBeforeUnmount(() => {
	clearMessages();
});
</script>

<template>
	<LayoutAuthShell>
		<div class="space-y-6">
			<UiAlert
				v-if="error"
				type="error"
				:message="error"
				@close="clearMessages()"
			/>
			<UiAlert
				v-if="success"
				type="success"
				:message="success"
				@close="clearMessages()"
			/>

			<div class="text-center space-y-2">
				<h1 class="text-3xl font-bold text-gray-900">Sign in</h1>
				<p class="text-gray-600">
					Access your account and manage your settings.
				</p>
			</div>

			<UiCard>
				<AuthProviders @provider="onSignInWithProvider" />
				<AuthLoginForm @submit="onSubmit" :loading="loading" />
			</UiCard>
		</div>
	</LayoutAuthShell>
</template>
