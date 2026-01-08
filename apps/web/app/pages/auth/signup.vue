<script setup lang="ts">
definePageMeta({
	layout: false,
});

useHead({
	title: "Sign Up - Account Wrikka",
});

const { signUp, signInWithOAuth, loading, clearMessages } = useAuth();

const onSubmit = async (
	formData: {
		email: any;
		password: any;
		firstName?: string;
		lastName?: string;
	},
) => {
	clearMessages();
	await signUp({ ...formData, confirmPassword: formData.password });
	// On success, the user will see a success message.
};

const onSignInWithProvider = async (
	provider: "google" | "github" | "microsoft",
) => {
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
				<h1 class="text-3xl font-bold text-gray-900">Create your account</h1>
				<p class="text-gray-600">Get started in a minute.</p>
			</div>

			<UiCard>
				<AuthProviders @provider="onSignInWithProvider" />
				<AuthSignupForm @submit="onSubmit" :loading="loading" />
			</UiCard>
		</div>
	</LayoutAuthShell>
</template>
