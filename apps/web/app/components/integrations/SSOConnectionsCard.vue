<script setup lang="ts">
import type { SsoConnection } from "~/shared/types";

defineProps<{
	connections: SsoConnection[];
}>();
</script>

<template>
	<UiCard class="p-6">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
				SSO Connections
			</h2>
			<span class="text-sm text-gray-600 dark:text-gray-300">
				{{ connections.length }}
			</span>
		</div>

		<div v-if="connections.length === 0" class="mt-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				No SSO connections yet.
			</p>
		</div>

		<div v-else class="mt-4 grid gap-3">
			<div
				v-for="c in connections"
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
</template>
