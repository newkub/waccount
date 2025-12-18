<script setup lang="ts">
interface Props {
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	loading?: boolean;
	variant?: "primary" | "secondary";
}

withDefaults(defineProps<Props>(), {
	type: "button",
	variant: "primary",
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'w-full px-4 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    ]"
  >
    <span v-if="loading">Loading...</span>
    <slot v-else />
  </button>
</template>
