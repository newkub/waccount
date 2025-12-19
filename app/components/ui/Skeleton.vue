<template>
  <div class="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" :style="{ height: height, width: width }" />
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: '1rem',
  },
  width: {
    type: String,
    default: '100%',
  },
});
</script>
