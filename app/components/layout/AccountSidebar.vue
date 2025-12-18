<script setup lang="ts">
import type { User } from '~/shared/types';

defineProps<{
  user: User | null;
  navItems: { id: string; icon: string; label: string; href: (id: string) => string }[];
  currentTab: string;
}>();
</script>

<template>
  <div class="lg:bg-white/80 lg:backdrop-blur-md lg:rounded-2xl lg:shadow-xl lg:border lg:border-primary-100 lg:p-6 lg:m-4">
    <LayoutAccountSidebarHeader />
    <LayoutAccountSidebarUserInfo :user="user" />
    <LayoutAccountSidebarNav :user="user" :nav-items="navItems" :current-tab="currentTab" />
    <LayoutAccountSidebarFooter />
  </div>
</template>
