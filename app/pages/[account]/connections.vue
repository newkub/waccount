<script setup lang="ts">
import { ref, computed } from 'vue'

// TypeScript interfaces
interface Connection {
	id: string
	provider: string
	type: 'sso' | 'integration'
	status: 'active' | 'error' | 'expired'
	email: string
	connectedAt: string
	lastUsed: string
	permissions: string[]
	workspace?: string
}

interface Provider {
	id: string
	name: string
	type: 'sso' | 'integration'
	description: string
	icon: string
	color: string
}

definePageMeta({
	layout: 'account',
	middleware: ['auth']
})

const { user } = useAuth()
const loading = ref(false)
const connections = ref<Connection[]>([])
const availableProviders = ref<Provider[]>([])

// Mock data - จะเชื่อมกับ WorkOS Connections API
const mockConnections: Connection[] = [
	{
		id: 'conn_google_123',
		provider: 'Google',
		type: 'sso',
		status: 'active',
		email: user.value?.email || '',
		connectedAt: '2024-01-15',
		lastUsed: '2024-03-20',
		permissions: ['email', 'profile', 'calendar']
	},
	{
		id: 'conn_slack_456',
		provider: 'Slack',
		type: 'integration',
		status: 'active',
		email: user.value?.email || '',
		connectedAt: '2024-02-10',
		lastUsed: '2024-03-19',
		workspace: 'wrikka-team',
		permissions: ['channels:read', 'messages:write']
	}
]

const mockProviders: Provider[] = [
	{
		id: 'microsoft',
		name: 'Microsoft 365',
		type: 'sso',
		description: 'Connect with Microsoft Azure AD',
		icon: 'mdi:microsoft',
		color: 'blue'
	},
	{
		id: 'slack',
		name: 'Slack',
		type: 'integration',
		description: 'Connect your Slack workspace',
		icon: 'mdi:slack',
		color: 'purple'
	},
	{
		id: 'github',
		name: 'GitHub',
		type: 'integration',
		description: 'Connect your GitHub account',
		icon: 'mdi:github',
		color: 'gray'
	},
	{
		id: 'notion',
		name: 'Notion',
		type: 'integration',
		description: 'Sync with Notion workspace',
		icon: 'simple-icons:notion',
		color: 'black'
	}
]

// Initialize data
onMounted(async () => {
	connections.value = mockConnections
	availableProviders.value = mockProviders
})

const activeConnections = computed(() => {
	return connections.value.filter(conn => conn.status === 'active')
})

const ssoConnections = computed(() => {
	return connections.value.filter(conn => conn.type === 'sso')
})

const integrations = computed(() => {
	return connections.value.filter(conn => conn.type === 'integration')
})

const connectProvider = async (providerId: string) => {
	try {
		loading.value = true
		// TODO: เชื่อมกับ WorkOS Connections API
		console.log('Connecting to provider:', providerId)
		
		// Redirect to OAuth flow
		window.location.href = `/api/auth/workos/authorize/${providerId}`
	} catch (error) {
		console.error('Failed to connect provider:', error)
	} finally {
		loading.value = false
	}
}

const disconnectProvider = async (connectionId: string) => {
	try {
		loading.value = true
		// TODO: เชื่อมกับ WorkOS Connections API
		console.log('Disconnecting provider:', connectionId)
		
		// Remove from connections
		connections.value = connections.value.filter(conn => conn.id !== connectionId)
	} catch (error) {
		console.error('Failed to disconnect provider:', error)
	} finally {
		loading.value = false
	}
}

const refreshConnection = async (connectionId: string) => {
	try {
		loading.value = true
		// TODO: เชื่อมกับ WorkOS Connections API
		console.log('Refreshing connection:', connectionId)
		
		// Update last used time
		const connection = connections.value.find(conn => conn.id === connectionId)
		if (connection) {
			connection.lastUsed = new Date().toISOString().split('T')[0] || ''
		}
	} catch (error) {
		console.error('Failed to refresh connection:', error)
	} finally {
		loading.value = false
	}
}

const getProviderIcon = (providerName: string): string => {
	const iconMap: { [key: string]: string } = {
		'Google': 'mdi:google',
		'Slack': 'mdi:slack',
		'Microsoft': 'mdi:microsoft',
		'GitHub': 'mdi:github',
		'Notion': 'simple-icons:notion'
	}
	return iconMap[providerName] || 'mdi:account'
}

const getStatusColor = (status: string) => {
	switch (status) {
		case 'active': return 'text-green-600 bg-green-50'
		case 'error': return 'text-red-600 bg-red-50'
		case 'expired': return 'text-yellow-600 bg-yellow-50'
		default: return 'text-gray-600 bg-gray-50'
	}
}
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
					<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
						{{ ssoConnections.length }} Active
					</span>
				</div>
				
				<div v-if="ssoConnections.length === 0" class="text-center py-8">
					<Icon name="mdi:shield-key" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600 mb-4">No SSO connections configured</p>
					<p class="text-sm text-gray-500">Connect with your organization's identity provider</p>
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
									<h4 class="font-semibold text-gray-900">{{ connection.provider }}</h4>
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
								<span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(connection.status)]">
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
					<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
						{{ integrations.length }} Connected
					</span>
				</div>
				
				<div v-if="integrations.length === 0" class="text-center py-8">
					<Icon name="mdi:puzzle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600 mb-4">No integrations connected</p>
					<p class="text-sm text-gray-500">Connect your favorite tools and services</p>
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
									<h4 class="font-semibold text-gray-900">{{ connection.provider }}</h4>
									<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
										<span v-if="connection.workspace">{{ connection.workspace }}</span>
										<span>•</span>
										<span>Connected {{ new Date(connection.connectedAt).toLocaleDateString() }}</span>
									</div>
									<div class="flex items-center gap-2 mt-2">
										<span v-for="permission in connection.permissions" :key="permission" 
											class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
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
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Available Connections</h3>
				
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
					<h3 class="text-lg font-semibold text-gray-900">WorkOS Connection Features</h3>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="flex items-start gap-3">
						<Icon name="mdi:key-variant" class="w-5 h-5 text-green-600 mt-0.5" />
						<div>
							<p class="font-medium text-gray-900">Secure OAuth 2.0</p>
							<p class="text-sm text-gray-600">Industry-standard authentication</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="mdi:sync" class="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<p class="font-medium text-gray-900">Real-time Sync</p>
							<p class="text-sm text-gray-600">Automatic data synchronization</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="mdi:shield-account" class="w-5 h-5 text-purple-600 mt-0.5" />
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
