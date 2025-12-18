<script setup lang="ts">
import type { User } from '~/shared/types';

defineProps<{
  user: User | null;
  navItems: { id: string; icon: string; label: string; href: (id: string) => string }[];
  currentTab: string;
}>();
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <div class="p-6">
      <LayoutAccountSidebarHeader />
      <LayoutAccountSidebarUserInfo :user="user" />
    </div>
    <div class="flex-1 overflow-y-auto px-6">
      <LayoutAccountSidebarNav :user="user" :nav-items="navItems" :current-tab="currentTab" />
    </div>
    <div class="p-6 mt-auto">
      <LayoutAccountSidebarFooter />
    </div>
  </div>
</template>
