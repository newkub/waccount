<script setup lang="ts">
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: false,
});

useHead({
	title: "Sign In - Account Wrikka",
});

const { signInWithPassword, signInWithOAuth, loading, clearMessages } = useAuth();

const onSubmit = async (formData: { email: any; password: any }) => {
	clearMessages();
	await signInWithPassword({ email: formData.email, password: formData.password });
	await navigateTo("/dashboard");
};

const onSignInWithProvider = async (provider: "google" | "github" | "microsoft") => {
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
