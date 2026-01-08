<script setup lang="ts">
import type { OrgHealthResponse } from "~/shared/types";

defineProps<{
	healthData: OrgHealthResponse | null;
	pending: boolean;
	error: boolean;
}>();
</script>

<template>
	<UiCard class="p-6">
		<div class="flex items-start justify-between gap-4">
			<div>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
					Health
				</h2>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
					Quick snapshot for this org.
				</p>
			</div>
			<div class="text-sm text-gray-600 dark:text-gray-300">
				<span v-if="pending">Loading...</span>
				<span v-else-if="error">Unavailable</span>
				<span v-else>
					Generated: {{ healthData?.generatedAt }}
				</span>
			</div>
		</div>

		<div class="mt-4 grid gap-3 md:grid-cols-2">
			<div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
				<div class="font-medium text-gray-900 dark:text-white">
					SSO Connections
				</div>
				<div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
					Total: {{ healthData?.ssoConnections.count ?? 0 }}
					• Active: {{ healthData?.ssoConnections.activeCount ?? 0 }}
					• Inactive: {{ healthData?.ssoConnections.inactiveCount ?? 0 }}
				</div>
			</div>
			<div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
				<div class="font-medium text-gray-900 dark:text-white">
					Directories
				</div>
				<div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
					Total: {{ healthData?.directories.count ?? 0 }}
					• Healthy: {{ healthData?.directories.healthyCount ?? 0 }}
					• Unhealthy: {{ healthData?.directories.unhealthyCount ?? 0 }}
				</div>
			</div>
		</div>
	</UiCard>
</template>
