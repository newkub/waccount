<script setup lang="ts">
defineProps<{
	recoveryEmail: string | null;
}>();

const emit = defineEmits<{
	update: [email: string];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
		<h3 class="text-lg font-semibold mb-4">Recovery Email</h3>
		<div class="flex items-center gap-4">
			<input
				:value="recoveryEmail || ''"
				@change="emit('update', ($event.target as HTMLInputElement).value)"
				type="email"
				class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
				placeholder="recovery@example.com"
			>
			<button
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
			>
				Update
			</button>
		</div>
	</div>
</template>
