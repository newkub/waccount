<script setup lang="ts">
import { useAuth } from '~/composables/facade/useAuth';

const { user } = useAuth();
const activities = ref([]); // Mock empty activities
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Activity Log</h2>

    <div v-if="activities.length === 0" class="text-center py-16 px-6 bg-gray-50 rounded-lg">
      <Icon name="mdi:view-list" class="w-16 h-16 text-gray-400 mx-auto mb-6" />
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No Recent Activity</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-6">
        All your account activities, such as logins and security changes, will be logged here for your review.
      </p>
      <button class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
        Learn More About Security
      </button>
    </div>

    <!-- This part will be used when there is actual activity data -->
    <div v-else>
      <!-- Activity list will go here -->
    </div>
  </div>
</template>
