<script setup lang="ts">
const showPasswordForm = ref(false);

defineEmits(['success', 'error']);
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900">Security</h3>
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="text-gray-600">Password</span>
        <span class="text-sm text-gray-500">••••••••</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="text-gray-600">Two-Factor Auth</span>
        <span class="text-sm text-amber-600">Not enabled</span>
      </div>
    </div>
    <button
      @click="showPasswordForm = !showPasswordForm"
      class="w-full px-4 py-2 border border-primary-600 text-primary-600 text-center font-medium rounded-lg hover:bg-primary-50 transition-colors"
    >
      {{ showPasswordForm ? 'Cancel' : 'Change Password' }}
    </button>

    <div v-if="showPasswordForm" class="mt-6 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
      <UserPasswordSettings @success="(msg) => $emit('success', msg)" @error="(msg) => $emit('error', msg)" />
    </div>
  </div>
</template>
