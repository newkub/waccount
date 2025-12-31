<script setup lang="ts">
import type { OrgIntegrationsResponse } from "#shared/types";
import type { OrgHealthResponse } from "#shared/types";

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
						<span v-if="healthFetch.pending.value">Loading...</span>
						<span v-else-if="healthFetch.error.value">Unavailable</span>
						<span v-else>
							Generated: {{ healthFetch.data.value?.generatedAt }}
						</span>
					</div>
				</div>

				<div class="mt-4 grid gap-3 md:grid-cols-2">
					<div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
						<div class="font-medium text-gray-900 dark:text-white">
							SSO Connections
						</div>
						<div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
							Total: {{ healthFetch.data.value?.ssoConnections.count ?? 0 }}
							• Active: {{
								healthFetch.data.value?.ssoConnections.activeCount ?? 0
							}}
							• Inactive: {{
								healthFetch.data.value?.ssoConnections.inactiveCount ?? 0
							}}
						</div>
					</div>
					<div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
						<div class="font-medium text-gray-900 dark:text-white">
							Directories
						</div>
						<div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
							Total: {{ healthFetch.data.value?.directories.count ?? 0 }}
							• Healthy: {{
								healthFetch.data.value?.directories.healthyCount ?? 0
							}}
							• Unhealthy: {{
								healthFetch.data.value?.directories.unhealthyCount ?? 0
							}}
						</div>
					</div>
				</div>
			</UiCard>

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
							@click="openPortal(data!.portals.sso)"
						>
							SSO Portal
						</UiButton>
						<UiButton
							variant="secondary"
							@click="openPortal(data!.portals.dsync)"
						>
							Directory Sync Portal
						</UiButton>
						<UiButton
							variant="secondary"
							@click="openPortal(data!.portals.auditLogs)"
						>
							Audit Logs Portal
						</UiButton>
					</div>
				</div>
			</UiCard>

			<UiCard class="p-6">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						SSO Connections
					</h2>
					<span class="text-sm text-gray-600 dark:text-gray-300">
						{{ data?.ssoConnections?.length ?? 0 }}
					</span>
				</div>

				<div v-if="(data?.ssoConnections?.length ?? 0) === 0" class="mt-4">
					<p class="text-sm text-gray-600 dark:text-gray-300">
						No SSO connections yet.
					</p>
				</div>

				<div v-else class="mt-4 grid gap-3">
					<div
						v-for="c in data?.ssoConnections ?? []"
						:key="c.id"
						class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{{ c.name }}
								</div>
								<div class="text-sm text-gray-600 dark:text-gray-300">
									{{ c.type }} • {{ c.state }}
								</div>
								<div
									v-if="(c.domains?.length ?? 0) > 0"
									class="mt-2 text-xs text-gray-500"
								>
									Domains: {{ c.domains?.join(", ") }}
								</div>
							</div>
							<code class="text-xs text-gray-500">{{ c.id }}</code>
						</div>
					</div>
				</div>
			</UiCard>

			<UiCard class="p-6">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						Directories
					</h2>
					<span class="text-sm text-gray-600 dark:text-gray-300">
						{{ data?.directories?.length ?? 0 }}
					</span>
				</div>

				<div v-if="(data?.directories?.length ?? 0) === 0" class="mt-4">
					<p class="text-sm text-gray-600 dark:text-gray-300">
						No directories yet.
					</p>
				</div>

				<div v-else class="mt-4 grid gap-3">
					<div
						v-for="d in data?.directories ?? []"
						:key="d.id"
						class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{{ d.name }}
								</div>
								<div class="text-sm text-gray-600 dark:text-gray-300">
									{{ d.type }} • {{ d.state }}
								</div>
							</div>
							<code class="text-xs text-gray-500">{{ d.id }}</code>
						</div>
					</div>
				</div>
			</UiCard>
		</div>
	</div>
</template>
