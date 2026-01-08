<script setup lang="ts">
import type { OrgIntegrationsResponse } from "~/shared/types";
import type { OrgHealthResponse } from "~/shared/types";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const org = computed(() => String(route.params.org ?? ""));

const { data, pending, error, refresh } = useFetch<OrgIntegrationsResponse>(
	() => `/api/orgs/${org.value}/integrations`,
);

const healthFetch = useFetch<OrgHealthResponse>(
	() => `/api/orgs/${org.value}/health`,
);

const openPortal = (url: string) => {
	window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				Integrations
			</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Manage SSO, Directory Sync, and Audit Logs for <code>{{ org }}</code>
			</p>
		</div>

		<UiCard class="p-6" v-if="pending">
			<p class="text-gray-600 dark:text-gray-300">Loading integrations...</p>
		</UiCard>

		<UiCard class="p-6" v-else-if="error">
			<div class="space-y-4">
				<p class="text-red-600">Failed to load integrations.</p>
				<UiButton variant="secondary" @click="refresh()">Retry</UiButton>
			</div>
		</UiCard>

		<div v-else class="space-y-6">
			<OrgHealthCard
				:health-data="healthFetch.data.value"
				:pending="healthFetch.pending.value"
				:error="healthFetch.error.value"
			/>

			<AdminPortalsCard
				:portals="data!.portals"
				@open-portal="openPortal"
			/>

			<SSOConnectionsCard
				:connections="data?.ssoConnections ?? []"
			/>

			<DirectoriesCard
				:directories="data?.directories ?? []"
			/>
		</div>
	</div>
</template>
