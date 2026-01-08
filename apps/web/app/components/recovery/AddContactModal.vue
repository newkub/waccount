<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	loading: boolean;
	form: {
		name: string;
		email: string;
		relationship: string;
	};
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
}>();
</script>

<template>
	<div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
			<h2 class="text-xl font-bold mb-4">Add Trusted Contact</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-2">Name</label>
					<input
						v-model="form.name"
						type="text"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
						placeholder="Contact name"
					>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Email</label>
					<input
						v-model="form.email"
						type="email"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
						placeholder="contact@example.com"
					>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Relationship</label>
					<input
						v-model="form.relationship"
						type="text"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
						placeholder="Friend, Family, etc."
					>
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
					Add
				</button>
			</div>
		</div>
	</div>
</template>
