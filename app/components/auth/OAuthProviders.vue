<script setup lang="ts">
const { signInWithOAuth } = useAuth();

const oauthProviders = [
  { name: 'Google', icon: 'i-mdi-google', class: 'bg-red-500 hover:bg-red-600', provider: 'google' },
  { name: 'GitHub', icon: 'i-mdi-github', class: 'bg-gray-800 hover:bg-gray-900', provider: 'github' },
];
</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button
        v-for="provider in oauthProviders"
        :key="provider.name"
        @click="signInWithOAuth(provider.provider)"
        :class="['w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-medium rounded-lg transition-colors', provider.class]"
      >
        <i :class="provider.icon"></i>
        <span>{{ provider.name }}</span>
      </button>
    </div>
    <div class="flex items-center my-4">
      <hr class="w-full border-gray-300" />
      <span class="px-2 text-gray-500">OR</span>
      <hr class="w-full border-gray-300" />
    </div>
  </div>
</template>
