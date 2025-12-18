<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
	type?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
}>();
</script>

<template>
  <input
    v-model="model"
    :type="type || 'text'"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
  />
</template>
