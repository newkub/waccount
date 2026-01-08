<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	loading: boolean;
	selectedFormat: "json" | "csv";
	selectedInclude: string[];
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
	toggleInclude: [value: string];
}>();
</script>

<template>
	<div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
			<h2 class="text-xl font-bold mb-4">Create Data Export</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-2">Format</label>
					<select v-model="selectedFormat" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
						<option value="json">JSON</option>
						<option value="csv">CSV</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Include</label>
					<div class="space-y-2">
						<label class="flex items-center">
							<input
								type="checkbox"
								:checked="selectedInclude.includes('profile')"
								@change="emit('toggleInclude', 'profile')"
								class="mr-2"
							>
							Profile
						</label>
						<label class="flex items-center">
							<input
								type="checkbox"
								:checked="selectedInclude.includes('organizations')"
								@change="emit('toggleInclude', 'organizations')"
								class="mr-2"
							>
							Organizations
						</label>
						<label class="flex items-center">
							<input
								type="checkbox"
								:checked="selectedInclude.includes('billing')"
								@change="emit('toggleInclude', 'billing')"
								class="mr-2"
							>
							Billing
						</label>
					</div>
				</div>
			</div>
			<div class="flex justify-end gap-2 mt-6">
				<button
					class="px-4 py-2 text-gray-600 hover:text-gray-900"
					@click="emit('close')"
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
					:disabled="loading"
					@click="emit('submit')"
				>
					Create
				</button>
			</div>
		</div>
	</div>
</template>
