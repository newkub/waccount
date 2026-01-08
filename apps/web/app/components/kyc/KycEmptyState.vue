<script setup lang="ts">
const openForm = defineModel<boolean>();
</script>

<template>
	<div class="text-center py-12">
		<Icon name="mdi:card-account-details" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
		<h3 class="text-lg font-semibold text-gray-900 mb-2">Verify your identity</h3>
		<p class="text-gray-600 mb-4">
			Complete identity verification to unlock all account features
		</p>
		<button
			@click="openForm = true"
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
		>
			Start Verification
		</button>
	</div>
</template>
