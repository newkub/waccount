<script setup lang="ts">
defineProps<{
	trustedContacts: Array<{
		id: string;
		name: string;
		email: string;
		relationship: string;
		verified: boolean;
	}>;
}>();

const emit = defineEmits<{
	addContact: [];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-lg font-semibold">Trusted Contacts</h3>
			<button
				@click="emit('addContact')"
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
			>
				Add Contact
			</button>
		</div>
		<div class="space-y-3">
			<div
				v-for="contact in trustedContacts"
				:key="contact.id"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
			>
				<div>
					<p class="font-medium">{{ contact.name }}</p>
					<p class="text-sm text-gray-600 dark:text-gray-400">{{ contact.email }}</p>
					<p class="text-xs text-gray-500">{{ contact.relationship }}</p>
				</div>
				<span
					class="px-2 py-1 text-xs rounded-full"
					:class="contact.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
				>
					{{ contact.verified ? 'Verified' : 'Pending' }}
				</span>
			</div>
		</div>
	</div>
</template>
