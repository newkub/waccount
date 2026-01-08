<script setup lang="ts">
import type { Webhook } from "~/shared/types";

const props = defineProps<{
	show: boolean;
	mode: "create" | "edit";
	webhook?: Webhook;
}>();

const emit = defineEmits<{
	close: [];
	save: [data: Partial<Webhook>];
}>();

const availableEvents = [
	{ id: "user.created", label: "User Created" },
	{ id: "user.updated", label: "User Updated" },
	{ id: "user.deleted", label: "User Deleted" },
	{ id: "organization.created", label: "Organization Created" },
	{ id: "organization.updated", label: "Organization Updated" },
	{ id: "organization.deleted", label: "Organization Deleted" },
	{ id: "billing.invoice.paid", label: "Invoice Paid" },
	{ id: "billing.subscription.created", label: "Subscription Created" },
	{ id: "billing.subscription.canceled", label: "Subscription Canceled" },
];

const formData = ref({
	url: props.webhook?.url || "",
	events: props.webhook?.events || [],
	active: props.webhook?.active ?? true,
});

const handleSave = () => {
	emit("save", formData.value);
};

watch(() => props.show, (show) => {
	if (show && props.webhook) {
		formData.value = {
			url: props.webhook.url,
			events: props.webhook.events,
			active: props.webhook.active,
		};
	} else if (show) {
		formData.value = { url: "", events: [], active: true };
	}
});
</script>

<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div class="bg-white rounded-lg p-6 w-full max-w-lg">
			<h3 class="text-xl font-bold text-gray-900 mb-4">
				{{ mode === "create" ? "Create" : "Edit" }} Webhook
			</h3>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
					<input
						v-model="formData.url"
						type="url"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="https://example.com/webhook"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Events</label>
					<div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
						<label
							v-for="event in availableEvents"
							:key="event.id"
							class="flex items-center gap-2 cursor-pointer"
						>
							<input
								v-model="formData.events"
								type="checkbox"
								:value="event.id"
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-700">{{ event.label }}</span>
						</label>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<input
						v-model="formData.active"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-sm text-gray-700">Active</span>
				</div>
			</div>
			<div class="flex justify-end gap-3 mt-6">
				<button
					class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					@click="emit('close')"
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					:disabled="!formData.url || formData.events.length === 0"
					@click="handleSave"
				>
					{{ mode === "create" ? "Create" : "Update" }}
				</button>
			</div>
		</div>
	</div>
</template>
