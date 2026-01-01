<<<<<<< HEAD
<script setup lang="ts">
import { useAuth } from "~/composables/auth";

definePageMeta({
  layout: false,
});

useHead({
  title: "Reset Password - Account Wrikka",
});

const route = useRoute();
const token = computed(() => {
  const q = route.query.token;
  if (typeof q === "string" && q) return q;
  return "";
});

const { updatePasswordWithToken, loading, error, success, clearMessages } = useAuth();

const form = reactive({
  newPassword: "",
  confirmPassword: "",
});

const localError = ref<string | null>(null);

const displayError = computed(() => localError.value || error.value);

const passwordMismatch = computed(() =>
  form.newPassword && form.confirmPassword
    ? form.newPassword !== form.confirmPassword
    : false
);

const validate = () => {
  localError.value = null;
  if (!token.value) {
    localError.value = "Missing reset token.";
    return false;
  }
  if (!form.newPassword || form.newPassword.length < 8) {
    localError.value = "Password must be at least 8 characters.";
    return false;
  }
  if (passwordMismatch.value) {
    localError.value = "Passwords do not match.";
    return false;
  }
  return true;
};

const onSubmit = async () => {
  clearMessages();
  if (!validate()) return;

  await updatePasswordWithToken(token.value, form.newPassword);
  if (!error.value) {
    await navigateTo("/auth/login?password_reset=true");
  }
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
        <h1 class="text-3xl font-bold text-gray-900">Choose a new password</h1>
        <p class="text-gray-600">Use at least 8 characters.</p>
      </div>

      <UiCard>
        <form class="p-6 space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700" for="newPassword">
              New password
            </label>
            <UiInput
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label
              class="text-sm font-medium text-gray-700"
              for="confirmPassword"
            >
              Confirm new password
            </label>
            <UiInput
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repeat your password"
              required
            />
            <p v-if="passwordMismatch" class="text-sm text-red-600">
              Passwords do not match.
            </p>
          </div>

          <UiButton type="submit" :loading="loading" class="w-full">
            Update password
          </UiButton>

          <div class="text-center text-sm text-gray-600">
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
||||||| e08b327
=======
<script setup lang="ts">
import { ref } from 'vue'

useHead({
	title: "Reset Password - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});

import { useAuth } from '~/composables/auth';

const { resetPassword, loading, error, success, clearMessages } = useAuth()

const form = ref({
  email: '',
})

const handleSubmit = async () => {
  try {
    clearMessages()
    await resetPassword(form.value.email)
  } catch (err: any) {
    console.error('Reset password error:', err)
  }
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto overflow-hidden p-8">
			<div class="text-center mb-8">
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
				<p class="text-base text-gray-600">Enter your email to receive password reset instructions</p>
			</div>

			<form @submit.prevent="handleSubmit" class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
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

				<div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-sm text-red-600">{{ error }}</p>
				</div>

				<div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-sm text-green-600">{{ success }}</p>
				</div>

				<button 
					type="submit" 
					:disabled="loading" 
					class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{{ loading ? 'Sending...' : 'Send Reset Email' }}
				</button>
			</form>

			<div class="mt-6 text-center">
				<NuxtLink to="/auth/signin" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
					Back to Sign In
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
>>>>>>> origin/main
