<script setup lang="ts">
const { signOut } = useAuth();
</script>

<template>
  <div class="mt-8 pt-6 border-t border-gray-200 space-y-2">
    <NuxtLink
      to="/"
      class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-medium transition-all duration-200"
    >
      <i class="i-mdi-home text-lg"></i>
      <span>Back to Home</span>
    </NuxtLink>

    <button @click="signOut" class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 w-full text-left">
      <i class="i-mdi-logout text-lg"></i>
      <span>Sign Out</span>
    </button>
  </div>
</template>
