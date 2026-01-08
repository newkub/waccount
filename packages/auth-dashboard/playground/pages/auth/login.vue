<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Sign in
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Demo login page
        </p>
      </div>

      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="handleLogin"
      >
        Sign In (Demo)
      </button>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Or
        <NuxtLink to="/" class="text-blue-600 hover:underline">
          go to home
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleLogin = () => {
  useAuthDashboard().setUser({
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'mdi:account',
    emailVerified: true,
  })
  navigateTo('/account')
}
</script>
