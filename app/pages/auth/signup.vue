<<<<<<< HEAD
<script setup lang="ts">
import { useAuth } from "~/composables/auth";

definePageMeta({
	layout: false,
});

useHead({
	title: "Sign Up - Account Wrikka",
});

const { signUp, signInWithProvider, loading, error, success, clearMessages } = useAuth();

const onSubmit = async (formData: { email: any; password: any; firstName?: string; lastName?: string }) => {
	clearMessages();
	await signUp(formData.email, formData.password, {
		firstName: formData.firstName,
		lastName: formData.lastName,
	});
	// On success, the user will see a success message.
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
				v-if="success"
				type="success"
				:message="success"
				@close="clearMessages()"
			/>
			<UiAlert
				v-if="error"
				type="error"
				:message="error"
				@close="clearMessages()"
			/>

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
||||||| e08b327
=======
<script setup lang="ts">
useHead({
	title: "Sign Up - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<AuthUI mode="signup" />
	</div>
</template>
>>>>>>> origin/main
