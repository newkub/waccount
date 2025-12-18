<script setup lang="ts">
const activeTab = ref<'login' | 'register'>('login');
</script>

<template>
  <div>
    <div class="p-8">
      <AuthOAuthProviders />
    </div>
    <AuthTabs v-model="activeTab" />
    <AuthTabContent :active-tab="activeTab" />
  </div>
</template>

