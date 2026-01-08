<script setup lang="ts">
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
		<SettingsConnectionsConnectionsHeader />

		<div class="space-y-6">
			<SettingsConnectionsSsoConnectionList
				:sso-connections="ssoConnections"
				:loading="loading"
				@refresh="refreshConnection"
				@disconnect="disconnectProvider"
			/>

			<SettingsConnectionsIntegrationList
				:integrations="integrations"
				:loading="loading"
				@refresh="refreshConnection"
				@disconnect="disconnectProvider"
			/>

			<SettingsConnectionsAvailableConnectionList
				:available-providers="availableProviders"
				@connect="connectProvider"
			/>

			<SettingsConnectionsWorkosFeatureInfo />
		</div>
	</div>
</template>
