<script setup lang="ts">
const { logout } = useAuth();

import type { User } from '~/app/shared/types/user';

defineProps<{
  user: User | null;
  navItems: { id: string; icon: string; label: string; href: (id: string) => string }[];
  currentTab: string;
}>();

</script>

<template>
  <div class="lg:bg-white/80 lg:backdrop-blur-md lg:rounded-2xl lg:shadow-xl lg:border lg:border-primary-100 lg:p-6 lg:m-4">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <i class="i-mdi-account-circle text-primary-600"></i>
        Account Management
      </h2>
      <p class="text-sm text-gray-600 mt-1">Manage your account settings</p>
    </div>

    <!-- User Info -->
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

    <!-- Navigation -->
    <nav class="space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.href(user?.id || '')"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
          currentTab === item.id
            ? 'bg-primary-100 text-primary-700 shadow-md'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        ]"
      >
        <i :class="item.icon" class="text-lg"></i>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer Actions -->
    <div class="mt-8 pt-6 border-t border-gray-200 space-y-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-medium transition-all duration-200"
      >
        <i class="i-mdi-home text-lg"></i>
        <span>Back to Home</span>
      </NuxtLink>

      <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 w-full text-left">
        <i class="i-mdi-logout text-lg"></i>
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</template>
