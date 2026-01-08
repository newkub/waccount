<script setup lang="ts">
const openCreateModal = defineModel<boolean>();
</script>

<template>
	<div class="text-center py-12">
		<Icon name="mdi:key-variant" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
		<h3 class="text-lg font-semibold text-gray-900 mb-2">No API keys configured</h3>
		<p class="text-gray-600 mb-4">
			Create an API key to integrate with our services programmatically
		</p>
		<button
			@click="openCreateModal = true"
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
		>
			Create Your First API Key
		</button>
	</div>
</template>
