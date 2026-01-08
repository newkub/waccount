<script setup lang="ts">
const { ssoConnections, refreshConnection, disconnectProvider, loading } = useConnectionsFacade();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900">Single Sign-On</h3>
			<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
				{{ ssoConnections.length }} Active
			</span>
		</div>

		<div v-if="ssoConnections.length === 0" class="text-center py-8">
			<Icon name="mdi:shield-key" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
			<p class="text-gray-600 mb-4">No SSO connections configured</p>
			<p class="text-sm text-gray-500">
				Connect with your organization's identity provider
			</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="connection in ssoConnections"
				:key="connection.id"
				class="bg-white rounded-lg border border-gray-200 p-4"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Icon :name="getProviderIcon(connection.provider)" class="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h4 class="font-semibold text-gray-900">
								{{ connection.provider }}
							</h4>
							<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
								<span>{{ connection.email }}</span>
								<span>•</span>
								<span>Connected {{ new Date(connection.connectedAt).toLocaleDateString() }}</span>
								<span>•</span>
								<span>Last used {{ new Date(connection.lastUsed).toLocaleDateString() }}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span
							:class="[
								'px-2 py-1 text-xs rounded-full',
								getConnectionStatusColor(connection.status),
							]"
						>
							{{ connection.status }}
						</span>
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
