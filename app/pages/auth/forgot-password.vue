<script setup lang="ts">
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: false,
});

const { requestPasswordReset, loading, error, success, clearMessages } =
	useAuth();

const form = reactive({
	email: "",
});

const localError = ref<string | null>(null);

const displayError = computed(() => localError.value || error.value);

const validate = () => {
	localError.value = null;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!form.email || !emailRegex.test(form.email)) {
		localError.value = "Please enter a valid email address.";
		return false;
	}
	return true;
};

const onSubmit = async () => {
	clearMessages();
	if (!validate()) return;
	await requestPasswordReset(form.email);
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
				<h1 class="text-3xl font-bold text-gray-900">Reset your password</h1>
				<p class="text-gray-600">
					We’ll email you a secure link to choose a new password.
				</p>
			</div>

			<UiCard>
				<form class="p-6 space-y-4" @submit.prevent="onSubmit">
					<div class="space-y-1.5">
						<label class="text-sm font-medium text-gray-700" for="email"
						>Email</label>
						<UiInput
							id="email"
							v-model="form.email"
							type="email"
							placeholder="you@company.com"
							required
						/>
					</div>

					<UiButton type="submit" :loading="loading" class="w-full">
						Send reset link
					</UiButton>

					<div class="text-center text-sm text-gray-600">
						Remembered your password?
						<NuxtLink
							to="/auth/login"
							class="font-medium text-primary-600 hover:underline"
						>
							Back to sign in
						</NuxtLink>
					</div>
				</form>
			</UiCard>
		</div>
	</LayoutAuthShell>
</template>
