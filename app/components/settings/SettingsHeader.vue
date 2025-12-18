<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
  <div v-if="user" class="flex items-center gap-3">
    <NuxtLink
      :to="`/${user.id}/profile`"
      class="p-2 hover:bg-white/60 rounded-lg transition-colors"
    >
      <i class="i-mdi-arrow-left text-2xl text-gray-600"></i>
    </NuxtLink>
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
      <p class="text-gray-600 mt-1">Manage your account preferences and security</p>
    </div>
  </div>
</template>
