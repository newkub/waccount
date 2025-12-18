<script setup lang="ts">
interface Props {
  redirectTo?: string;
  showSignInLink?: boolean;
  title?: string;
  subtitle?: string;
  noWrapper?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: "/auth/login?message=Registration successful. Please sign in.",
  showSignInLink: true,
  title: "Create Account",
  subtitle: "Sign up for a new account",
  noWrapper: false,
});

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error', error: string): void;
}>();

const {
  form,
  loading,
  success,
  displayError,
  passwordMismatch,
  handleSubmit,
  clearAllErrors,
} = useRegisterForm(emit, props.redirectTo);
</script>

<template>
  <component :is="props.noWrapper ? 'div' : 'UiCard'" :class="{ 'p-8 max-w-md mx-auto': !props.noWrapper }">
    <div v-if="title || subtitle" class="text-center mb-8">
      <h1 v-if="title" class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-600">{{ subtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <UiInput id="firstName" v-model="form.firstName" type="text" required :disabled="loading" placeholder="John" />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <UiInput id="lastName" v-model="form.lastName" type="text" required :disabled="loading" placeholder="Doe" />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <UiInput id="email" v-model="form.email" type="email" required :disabled="loading" placeholder="john@example.com" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <UiInput id="password" v-model="form.password" type="password" required minlength="8" :disabled="loading" placeholder="Minimum 8 characters" />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <UiInput id="confirmPassword" v-model="form.confirmPassword" type="password" required minlength="8" :disabled="loading" :class="{ 'border-red-300': passwordMismatch }" placeholder="Confirm your password" />
        <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
      </div>

      <UiButton type="submit" :loading="loading" :disabled="!form.email || !form.password || !form.firstName || !form.lastName || !form.confirmPassword">
        Create Account
      </UiButton>
    </form>

    <div v-if="displayError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <p class="text-red-700 text-sm">{{ displayError }}</p>
        <button @click="clearAllErrors" class="ml-auto text-red-400 hover:text-red-600">✕</button>
      </div>
    </div>

    <div v-if="success" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <p class="text-green-700 text-sm">{{ success }}</p>
        <button @click="clearAllErrors" class="ml-auto text-green-400 hover:text-green-600">✕</button>
      </div>
    </div>

    <div v-if="props.showSignInLink" class="mt-6 text-center">
      <p class="text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">Sign in</NuxtLink>
      </p>
    </div>
  </component>
</template>
