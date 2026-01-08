<script setup lang="ts">
import type { ApiKey } from "~/shared/types";

const props = defineProps<{
	apiKey: ApiKey;
	loading: boolean;
}>();

const emit = defineEmits<{
	regenerate: [id: string];
	delete: [id: string];
}>();

function maskApiKey(key: string) {
	return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

function getExpirationStatus(expiresAt: string | null | undefined) {
	if (!expiresAt) return { text: "Never expires", color: "text-gray-600" };
	
	const now = new Date();
	const exp = new Date(expiresAt);
	const daysLeft = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	
	if (daysLeft < 0) return { text: "Expired", color: "text-red-600" };
	if (daysLeft < 7) return { text: `Expires in ${daysLeft} days`, color: "text-orange-600" };
	if (daysLeft < 30) return { text: `Expires in ${daysLeft} days`, color: "text-yellow-600" };
	return { text: `Expires in ${daysLeft} days`, color: "text-gray-600" };
}
</script>

<template>
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<h3 class="text-lg font-semibold text-gray-900">{{ apiKey.name }}</h3>
					<span :class="['px-2 py-1 text-xs rounded-full', getExpirationStatus(apiKey.expiresAt).color]">
						{{ getExpirationStatus(apiKey.expiresAt).text }}
					</span>
				</div>
				<div class="bg-gray-50 rounded-lg p-3 mb-3">
					<code class="text-sm font-mono text-gray-700">{{ maskApiKey(apiKey.key) }}</code>
				</div>
				<div class="flex flex-wrap gap-2 mb-3">
					<span
						v-for="scope in apiKey.scopes"
						:key="scope"
						class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
					>
						{{ scope }}
					</span>
				</div>
				<div class="flex items-center gap-4 text-sm text-gray-600">
					<span>Created {{ new Date(apiKey.createdAt).toLocaleDateString() }}</span>
					<span v-if="apiKey.lastUsedAt">
						• Last used {{ new Date(apiKey.lastUsedAt).toLocaleDateString() }}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					@click="emit('regenerate', apiKey.id)"
					:disabled="loading"
					class="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
					title="Regenerate key"
				>
					<Icon name="mdi:refresh" class="w-5 h-5" />
				</button>
				<button
					@click="emit('delete', apiKey.id)"
					class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					title="Delete key"
				>
					<Icon name="mdi:delete" class="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</template>
