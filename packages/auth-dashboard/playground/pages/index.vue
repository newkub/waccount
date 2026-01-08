<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Welcome
      </h2>
      <p class="text-center text-gray-600 dark:text-gray-400">
        Auth Dashboard Module Demo
      </p>
      <NuxtLink
        to="/auth/login"
        class="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
      >
        Go to Login
      </NuxtLink>
    </div>
  </div>
</template>
