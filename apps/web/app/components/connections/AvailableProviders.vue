<script setup lang="ts">
const { availableProviders, connectProvider } = useConnectionsFacade();
</script>

<template>
	<div class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">
			Available Connections
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div
				v-for="provider in availableProviders"
				:key="provider.id"
				class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
				@click="connectProvider(provider.id)"
			>
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
						<Icon :name="provider.icon" class="w-5 h-5 text-gray-700" />
					</div>
					<div class="flex-1">
						<h4 class="font-medium text-gray-900">{{ provider.name }}</h4>
						<p class="text-sm text-gray-600">{{ provider.description }}</p>
					</div>
					<Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
				</div>
			</div>
		</div>
	</div>
</template>
