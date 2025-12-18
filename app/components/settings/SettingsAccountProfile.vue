<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
  <div v-if="user" class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900">Profile Information</h3>
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="text-gray-600">Name</span>
        <span class="font-medium">{{ user.firstName }} {{ user.lastName }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="text-gray-600">Email</span>
        <span class="font-medium">{{ user.email }}</span>
      </div>
    </div>
    <NuxtLink
      :to="`/${user.id}/profile`"
      class="block w-full px-4 py-2 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      Edit Profile
    </NuxtLink>
  </div>
</template>
