<script setup lang="ts">
const model = defineModel<string>();

interface Props {
	type?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
	type: "text",
});
</script>

<template>
	<input
		v-model="model"
		:type="type"
		:placeholder="placeholder"
		:required="required"
		:disabled="disabled"
		class="w-full px-4 py-2 bg-transparent dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-colors duration-200"
	/>
</template>
