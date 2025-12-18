<script setup lang="ts">
interface Activity {
	id: string;
	type: string;
	timestamp: string;
	[key: string]: unknown;
}

defineProps<{
	activities: Activity[];
	loading?: boolean;
}>();
</script>

<template>
  <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <i class="i-mdi-history text-primary-600"></i>
      Activity Log
    </h3>
    <div v-if="loading" class="text-center py-8">
      <i class="i-mdi-loading animate-spin text-3xl text-primary-500"></i>
      <p class="mt-2 text-gray-500">Loading activities...</p>
    </div>
    <div v-else-if="activities.length === 0" class="text-center py-8 text-gray-500">
      No activities found.
    </div>
    <ul v-else class="space-y-4">
      <li v-for="activity in activities" :key="activity.id" class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <i class="i-mdi-information-outline text-gray-500"></i>
        <div class="flex-1">
          <p class="font-medium text-gray-800">{{ activity.type }}</p>
          <p class="text-sm text-gray-500">{{ new Date(activity.timestamp).toLocaleString() }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
