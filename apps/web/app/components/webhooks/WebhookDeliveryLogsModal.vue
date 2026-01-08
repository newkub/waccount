<script setup lang="ts">
import type { Webhook } from "~/shared/types";

const props = defineProps<{
	show: boolean;
	webhook: Webhook | null;
}>();

const emit = defineEmits<{
	close: [];
}>();
</script>

<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-xl font-bold text-gray-900">Delivery Logs</h3>
				<button
					@click="emit('close')"
					class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
			<div class="flex-1 overflow-y-auto">
				<div class="text-center py-8 text-gray-600">
					<Icon name="mdi:history" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
					<p>Delivery logs will appear here</p>
				</div>
			</div>
		</div>
	</div>
</template>
