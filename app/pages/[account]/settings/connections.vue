<script setup lang="ts">
import { onMounted } from "vue";
import {
	getConnectionStatusColor,
	getProviderIcon,
} from "~/utils/connectionHelpers";

import { useAuth } from "~/composables/facade/useAuth";

const { user } = useAuth();
const {
	loading,
	availableProviders,
	fetchConnections,
	ssoConnections,
	integrations,
	connectProvider,
	disconnectProvider,
	refreshConnection,
} = useConnectionsFacade();

onMounted(fetchConnections);
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Connected Accounts</h2>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<Icon name="mdi:plus" class="w-4 h-4 mr-2" />
				Add Connection
			</button>
		</div>

		<div class="space-y-6">
			<!-- SSO Connections -->
			<div class="bg-gray-50 rounded-lg p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Single Sign-On</h3>
					<span
						class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
					>
						{{ ssoConnections.length }} Active
					</span>
				</div>

				<div v-if="ssoConnections.length === 0" class="text-center py-8">
					<Icon
						name="mdi:shield-key"
						class="w-12 h-12 text-gray-400 mx-auto mb-4"
					/>
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
									<Icon
										:name="getProviderIcon(connection.provider)"
										class="w-6 h-6 text-blue-600"
									/>
								</div>
								<div>
									<h4 class="font-semibold text-gray-900">
										{{ connection.provider }}
									</h4>
									<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
										<span>{{ connection.email }}</span>
										<span>•</span>
										<span>Connected {{
												new Date(connection.connectedAt).toLocaleDateString()
											}}</span>
										<span>•</span>
										<span>Last used {{
												new Date(connection.lastUsed).toLocaleDateString()
											}}</span>
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

			<!-- Integrations -->
			<div class="bg-gray-50 rounded-lg p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Integrations</h3>
					<span
						class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
					>
						{{ integrations.length }} Connected
					</span>
				</div>

				<div v-if="integrations.length === 0" class="text-center py-8">
					<Icon
						name="mdi:puzzle"
						class="w-12 h-12 text-gray-400 mx-auto mb-4"
					/>
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
									<Icon
										:name="getProviderIcon(connection.provider)"
										class="w-6 h-6 text-purple-600"
									/>
								</div>
								<div>
									<h4 class="font-semibold text-gray-900">
										{{ connection.provider }}
									</h4>
									<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
										<span v-if="connection.workspace">{{
											connection.workspace
										}}</span>
										<span>•</span>
										<span>Connected {{
												new Date(connection.connectedAt).toLocaleDateString()
											}}</span>
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

			<!-- Available Providers -->
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

			<!-- WorkOS Features Info -->
			<div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center gap-3 mb-4">
					<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
					<h3 class="text-lg font-semibold text-gray-900">
						WorkOS Connection Features
					</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="flex items-start gap-3">
						<Icon
							name="mdi:key-variant"
							class="w-5 h-5 text-green-600 mt-0.5"
						/>
						<div>
							<p class="font-medium text-gray-900">Secure OAuth 2.0</p>
							<p class="text-sm text-gray-600">
								Industry-standard authentication
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="mdi:sync" class="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<p class="font-medium text-gray-900">Real-time Sync</p>
							<p class="text-sm text-gray-600">
								Automatic data synchronization
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon
							name="mdi:shield-account"
							class="w-5 h-5 text-purple-600 mt-0.5"
						/>
						<div>
							<p class="font-medium text-gray-900">Enterprise Security</p>
							<p class="text-sm text-gray-600">SOC 2 Type II compliant</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
