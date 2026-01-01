<script setup lang="ts">
import { useAuth } from '~/composables/facade/useAuth';

useHead({
  title: "Processing Sign In - Account Wrikka",
});

const { refreshUser } = useAuth();

onMounted(async () => {
  try {
    const route = useRoute();
    const code = route.query.code as string;

    if (!code) {
      throw new Error('No authorization code provided');
    }

    // Exchange authorization code for a session via our backend
    await $fetch('/api/auth/workos/callback', {
      query: { code },
    });

    // Refresh the user state from the new session cookie
    await refreshUser();

    // Redirect to the account page on success
    await navigateTo('/account');

  } catch (error) {
    console.error('OAuth callback error:', error);
    // Redirect to login with an error message on failure
    await navigateTo('/auth/login?error=callback_failed');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
        <i class="i-mdi-loading w-6 h-6 text-blue-600 animate-spin"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Processing Sign In</h1>
      <p class="text-gray-600">Please wait while we complete your sign in...</p>
    </div>
  </div>
</template>
