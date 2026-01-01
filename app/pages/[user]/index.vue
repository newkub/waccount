<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

import { useAuth } from '~/composables/facade/useAuth';

const { user } = useAuth();
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Welcome to your Dashboard, {{ user?.firstName }}!
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-300">
      This is your central hub for managing everything. More widgets and summaries will be added here soon.
    </p>
  </div>
</template>
