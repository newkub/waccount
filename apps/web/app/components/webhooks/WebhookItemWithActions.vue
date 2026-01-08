<script setup lang="ts">
import type { Webhook } from "~/shared/types";

const props = defineProps<{
	webhook: Webhook;
	loading: boolean;
}>();

const emit = defineEmits<{
	edit: [webhook: Webhook];
	delete: [id: string];
	test: [webhook: Webhook];
	viewLogs: [webhook: Webhook];
}>();

function getWebhookStatusColor(active: boolean) {
	return active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
}
</script>

<template>
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<h3 class="text-lg font-semibold text-gray-900">{{ webhook.url }}</h3>
					<span :class="['px-2 py-1 text-xs rounded-full', getWebhookStatusColor(webhook.active)]">
						{{ webhook.active ? "Active" : "Inactive" }}
					</span>
				</div>
				<div class="flex flex-wrap gap-2 mb-3">
					<span
						v-for="event in webhook.events"
						:key="event"
						class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
					>
						{{ event }}
					</span>
				</div>
				<div class="flex items-center gap-4 text-sm text-gray-600">
					<span>Created {{ new Date(webhook.createdAt).toLocaleDateString() }}</span>
					<span v-if="webhook.lastTriggeredAt">
						• Last triggered {{ new Date(webhook.lastTriggeredAt).toLocaleDateString() }}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					@click="emit('test', webhook)"
					:disabled="loading"
					class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
					title="Test webhook"
				>
					<Icon name="mdi:play" class="w-5 h-5" />
				</button>
				<button
					@click="emit('viewLogs', webhook)"
					class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
					title="View delivery logs"
				>
					<Icon name="mdi:history" class="w-5 h-5" />
				</button>
				<button
					@click="emit('edit', webhook)"
					class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
					title="Edit webhook"
				>
					<Icon name="mdi:pencil" class="w-5 h-5" />
				</button>
				<button
					@click="emit('delete', webhook.id)"
					class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					title="Delete webhook"
				>
					<Icon name="mdi:delete" class="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</template>
