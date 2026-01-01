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
