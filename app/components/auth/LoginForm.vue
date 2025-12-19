<script setup lang="ts">
interface Props {
  showSignUpLink?: boolean;
  title?: string;
  subtitle?: string;
  noWrapper?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSignUpLink: true,
  title: "Welcome Back",
  subtitle: "Sign in to your account",
  noWrapper: false,
});

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error', error: string): void;
}>();

const { form, loading, error, handleSubmit, clearMessages } = useLoginForm(emit);</script>

<template>
  <component :is="props.noWrapper ? 'div' : 'div'" :class="{ 'p-8 max-w-md mx-auto': !props.noWrapper }">
    <div v-if="!noWrapper && (title || subtitle)" class="text-center mb-8">
      <h1 v-if="title" class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-600 dark:text-gray-300">{{ subtitle }}</p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
        <UiInput id="email" v-model="form.email" type="email" required :disabled="loading" placeholder="Enter your email" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
        <UiInput id="password" v-model="form.password" type="password" required :disabled="loading" placeholder="Enter your password" />
      </div>

      <UiButton type="submit" :loading="loading" :disabled="!form.email || !form.password" class="w-full">
        Sign In
      </UiButton>
    </form>

    <div v-if="error" class="mt-4">
      <UiAlert type="error" :message="error" @close="clearMessages" />
    </div>

    <div v-if="!noWrapper && showSignUpLink" class="mt-6 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">Sign up</NuxtLink>
      </p>
    </div>
  </component>
</template>
