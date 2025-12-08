<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>

<template>
  <div class="text-center mb-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ title }}</h1>
    <p class="text-base text-gray-600">{{ subtitle }}</p>
  </div>
</template>
