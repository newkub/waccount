<script setup lang="ts">
import type { Webhook } from "~/shared/types";

const props = defineProps<{
	webhook: Webhook;
}>();

const emit = defineEmits<{
	toggle: [webhook: Webhook];
	edit: [webhook: Webhook];
	delete: [id: string];
}>();
</script>

<template>
	<div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<h3 class="text-lg font-semibold text-gray-900">{{ webhook.url }}</h3>
					<span
						:class="[
							'px-2 py-1 text-xs rounded-full',
							webhook.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
						]"
					>
						{{ webhook.active ? "Active" : "Inactive" }}
					</span>
				</div>
				<div class="space-y-2">
					<div class="flex items-center gap-2 text-sm text-gray-600">
						<i class="i-mdi-key"></i>
						<span class="font-mono">{{ webhook.secret }}</span>
					</div>
					<div class="flex items-center gap-2 text-sm text-gray-600">
						<i class="i-mdi-calendar"></i>
						<span>Created: {{ new Date(webhook.createdAt).toLocaleDateString() }}</span>
					</div>
					<div v-if="webhook.lastTriggeredAt" class="flex items-center gap-2 text-sm text-gray-600">
						<i class="i-mdi-clock"></i>
						<span>Last triggered: {{ new Date(webhook.lastTriggeredAt).toLocaleString() }}</span>
					</div>
				</div>
				<div class="mt-3">
					<p class="text-sm font-medium text-gray-700 mb-2">Events:</p>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="event in webhook.events"
							:key="event"
							class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
						>
							{{ event }}
						</span>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
					:title="webhook.active ? 'Disable' : 'Enable'"
					@click="emit('toggle', webhook)"
				>
					<i :class="webhook.active ? 'i-mdi-toggle-switch' : 'i-mdi-toggle-switch-off'"></i>
				</button>
				<button
					class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
					title="Edit"
					@click="emit('edit', webhook)"
				>
					<i class="i-mdi-pencil"></i>
				</button>
				<button
					class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					title="Delete"
					@click="emit('delete', webhook.id)"
				>
					<i class="i-mdi-delete"></i>
				</button>
			</div>
		</div>
	</div>
</template>
