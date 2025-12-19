<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
  <div v-if="user" class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
      <p class="text-gray-600 mt-1">Manage your profile information and view activity</p>
    </div>
    <NuxtLink
      to="/account/settings"
      class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
      <i class="i-mdi-cog text-lg"></i>
      <span>Settings</span>
    </NuxtLink>
  </div>
</template>
