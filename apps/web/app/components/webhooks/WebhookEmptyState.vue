<script setup lang="ts">
const showCreateModal = defineModel<boolean>();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-12 text-center">
		<i class="i-mdi-webhook text-6xl text-gray-400 mb-4"></i>
		<h3 class="text-lg font-semibold text-gray-900 mb-2">No webhooks configured</h3>
		<p class="text-gray-600 mb-4">
			Create your first webhook to start receiving real-time notifications
		</p>
		<button
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			@click="showCreateModal = true"
		>
			Create Webhook
		</button>
	</div>
</template>
