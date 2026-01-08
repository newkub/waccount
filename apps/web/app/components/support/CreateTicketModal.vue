<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	loading: boolean;
	form: {
		subject: string;
		message: string;
		category: string;
		priority: string;
	};
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
}>();
</script>

<template>
	<div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
			<h2 class="text-xl font-bold mb-4">Create Support Ticket</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-2">Subject</label>
					<input
						v-model="form.subject"
						type="text"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
						placeholder="Brief description of your issue"
					>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Message</label>
					<textarea
						v-model="form.message"
						rows="4"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
						placeholder="Describe your issue in detail"
					></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-2">Category</label>
						<select v-model="form.category" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
							<option value="billing">Billing</option>
							<option value="technical">Technical</option>
							<option value="account">Account</option>
							<option value="feature">Feature Request</option>
							<option value="bug">Bug Report</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">Priority</label>
						<select v-model="form.priority" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
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
					Submit
				</button>
			</div>
		</div>
	</div>
</template>
