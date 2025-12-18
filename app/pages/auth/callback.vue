<script setup lang="ts">
useHead({
  title: "Authenticating - Account Wrikka",
});

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const error = computed(() => route.query.error as string);

// The server-side API route `/api/auth/workos/callback` handles the code exchange and redirection.
// This page is just a fallback UI to show the status to the user.
// The `useFetch` below will trigger the server route.
useFetch(computed(() => `/api/auth/workos/callback?code=${route.query.code}`), { 
  immediate: true,
  server: false, // We only want this to run on the client after the redirect from the provider
});

const retry = () => {
  navigateTo('/auth/login');
};
</script>

<template>
  <div>
    <!-- Error State -->
    <div v-if="error" class="text-center">
      <div class="mb-6">
        <i class="i-mdi-alert-circle-outline text-6xl text-red-500"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Authentication Failed
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <UiButton @click="retry" variant="primary" size="lg">
        Return to Login
      </UiButton>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center">
      <div class="mb-6">
        <i class="i-mdi-loading animate-spin text-6xl text-primary-500"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Authenticating...
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Please wait while we complete your sign-in.
      </p>
    </div>
  </div>
</template>
