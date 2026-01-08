<template>
  <AuthDashboardShell>
    <template #default>
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Auth Dashboard
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            This is a demo of the Auth Dashboard module
          </p>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            User Info
          </h3>
          <pre class="mt-4 overflow-x-auto">{{ user }}</pre>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Custom Tab Example
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            You can add custom tabs via the module config
          </p>
        </div>
      </div>
    </template>
  </AuthDashboardShell>
</template>

<script setup lang="ts">
const { user } = useAuthDashboard()
</script>
