<template>
  <div
    class="p-4 rounded-lg shadow-lg w-full pointer-events-auto"
    :class="toastClasses"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <i :class="[iconClasses, 'text-xl']"></i>
      </div>
      <div class="ml-3 w-0 flex-1">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button @click="$emit('close')" class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" :class="buttonClasses">
          <span class="sr-only">Close</span>
          <i class="i-mdi-close text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'info';
}>();

defineEmits(['close']);

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800';
    case 'error':
      return 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800';
    default:
      return 'bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800';
  }
});

const iconClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'i-mdi-check-circle text-green-500';
    case 'error':
      return 'i-mdi-alert-circle text-red-500';
    default:
      return 'i-mdi-information text-blue-500';
  }
});

const buttonClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-500 hover:text-green-600';
    case 'error':
      return 'text-red-500 hover:text-red-600';
    default:
      return 'text-blue-500 hover:text-blue-600';
  }
});
</script>
