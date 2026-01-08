<script setup lang="ts">
import type { OrgIntegrationsResponse } from "~/shared/types";

defineProps<{
	portals: OrgIntegrationsResponse['portals'];
}>();

const emit = defineEmits<{
	openPortal: [url: string];
}>();
</script>

<template>
	<UiCard class="p-6">
		<div class="flex items-start justify-between gap-4">
			<div>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
					Admin Portals
				</h2>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
					Open WorkOS Admin Portal for this organization.
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<UiButton
					variant="secondary"
					@click="emit('openPortal', portals.sso)"
				>
					SSO Portal
				</UiButton>
				<UiButton
					variant="secondary"
					@click="emit('openPortal', portals.dsync)"
				>
					Directory Sync Portal
				</UiButton>
				<UiButton
					variant="secondary"
					@click="emit('openPortal', portals.auditLogs)"
				>
					Audit Logs Portal
				</UiButton>
			</div>
		</div>
	</UiCard>
</template>
