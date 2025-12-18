<script setup lang="ts">
const activeTab = ref<'login' | 'register'>('login');
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto overflow-hidden">
    <div class="p-8">
      <AuthOAuthProviders />
    </div>
    <AuthTabs v-model="activeTab" />
    <AuthTabContent :active-tab="activeTab" />
  </div>
</template>

