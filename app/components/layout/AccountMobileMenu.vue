<script setup lang="ts">
import type { User } from "~/shared/types";

interface Props {
	user: User | null;
	navItems: any[];
	currentTab: string;
}

defineProps<Props>();
const emit = defineEmits(["close"]);
</script>

<template>
  <div>
    <!-- Mobile Menu Overlay -->
    <div
      class="lg:hidden fixed inset-0 bg-black/50 z-40"
      @click="$emit('close')"
    ></div>

    <!-- Mobile Menu -->
    <div class="fixed z-50 lg:hidden">
      <AccountSidebar :user="user" :nav-items="navItems" :current-tab="currentTab" />
    </div>
  </div>
</template>
