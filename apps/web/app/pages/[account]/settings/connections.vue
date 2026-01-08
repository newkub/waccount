<script setup lang="ts">
import { onMounted } from "vue";

import { useAuth } from "~/composables/facade/useAuth";

const { user } = useAuth();
const { fetchConnections } = useConnectionsFacade();

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
			<SSOConnections />
			<Integrations />
			<AvailableProviders />
			<WorkOSFeaturesInfo />
		</div>
	</div>
</template>
