<script setup lang="ts">
defineProps<{
	recoveryCodes: Array<{ code: string; used: boolean }>();
}>();

const emit = defineEmits<{
	generate: [];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-lg font-semibold">Backup Codes</h3>
			<button
				@click="emit('generate')"
				class="text-indigo-600 hover:text-indigo-900 text-sm"
			>
				Generate New Codes
			</button>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
			<div
				v-for="code in recoveryCodes"
				:key="code.code"
				class="p-2 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm"
				:class="{ 'line-through opacity-50': code.used }"
			>
				{{ code.code }}
			</div>
		</div>
	</div>
</template>
