<script setup lang="ts">
const { integrations, refreshConnection, disconnectProvider, loading } = useConnectionsFacade();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900">Integrations</h3>
			<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
				{{ integrations.length }} Connected
			</span>
		</div>

		<div v-if="integrations.length === 0" class="text-center py-8">
			<Icon name="mdi:puzzle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
			<p class="text-gray-600 mb-4">No integrations connected</p>
			<p class="text-sm text-gray-500">
				Connect your favorite tools and services
			</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="connection in integrations"
				:key="connection.id"
				class="bg-white rounded-lg border border-gray-200 p-4"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<Icon :name="getProviderIcon(connection.provider)" class="w-6 h-6 text-purple-600" />
						</div>
						<div>
							<h4 class="font-semibold text-gray-900">
								{{ connection.provider }}
							</h4>
							<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
								<span v-if="connection.workspace">{{ connection.workspace }}</span>
								<span>•</span>
								<span>Connected {{ new Date(connection.connectedAt).toLocaleDateString() }}</span>
							</div>
							<div class="flex items-center gap-2 mt-2">
								<span
									v-for="permission in connection.permissions"
									:key="permission"
									class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
								>
									{{ permission }}
								</span>
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							@click="refreshConnection(connection.id)"
							:disabled="loading"
							class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
							title="Refresh connection"
						>
							<Icon name="mdi:refresh" class="w-5 h-5" />
						</button>
						<button
							@click="disconnectProvider(connection.id)"
							:disabled="loading"
							class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
							title="Disconnect"
						>
							<Icon name="mdi:link-variant-off" class="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
