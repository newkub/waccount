<script setup lang="ts">
import type { User } from '~/app/shared/types/user';

defineProps<{ currentTab: string; user: User | null }>();
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-6 mb-8"
  >
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ currentTab === 'profile' ? 'Profile Management' : 'Account Settings' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{
            currentTab === 'profile'
              ? 'Manage your personal information and profile'
              : 'Configure your account preferences and security'
          }}
        </p>
      </div>

      <!-- Breadcrumb -->
      <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
        <i class="i-mdi-chevron-right"></i>
        <NuxtLink :to="`/${user?.id}/profile`" class="hover:text-primary-600"
          >Account</NuxtLink
        >
        <i class="i-mdi-chevron-right"></i>
        <span class="text-gray-900 font-medium">{{ 
          currentTab === 'profile' ? 'Profile' : 'Settings'
        }}</span>
      </div>
    </div>
  </div>
</template>
