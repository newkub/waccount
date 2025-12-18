<script setup lang="ts">
import type { User } from '~/shared/types';

defineProps<{
  user: User | null;
}>();
</script>

<template>
  <div v-if="user" class="mb-6 p-4 bg-primary-50 rounded-xl">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
        <i class="i-mdi-account text-lg text-primary-600"></i>
      </div>
      <div>
        <div class="font-medium text-gray-900">{{ user.firstName }}</div>
        <div class="text-sm text-gray-600">{{ user.email }}</div>
      </div>
    </div>
    <div class="text-xs text-gray-500">
      {{ user.emailVerified ? 'Email Verified' : 'Email Pending' }}
    </div>
  </div>
</template>
