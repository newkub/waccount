<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { webhooks, loading, fetchWebhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook } = useWebhooksFacade();

const showCreateModal = ref(false);
const editingWebhook = ref<Webhook | null>(null);
const selectedWebhook = ref<Webhook | null>(null);
const showDeliveryLogs = ref(false);

const webhookForm = reactive({
	url: "",
	events: [] as string[],
	active: true,
});

const availableEvents = [
	{ id: "user.created", label: "User Created" },
	{ id: "user.updated", label: "User Updated" },
	{ id: "user.deleted", label: "User Deleted" },
	{ id: "subscription.created", label: "Subscription Created" },
	{ id: "subscription.updated", label: "Subscription Updated" },
	{ id: "subscription.canceled", label: "Subscription Canceled" },
	{ id: "invoice.paid", label: "Invoice Paid" },
	{ id: "invoice.failed", label: "Invoice Failed" },
	{ id: "organization.created", label: "Organization Created" },
	{ id: "organization.updated", label: "Organization Updated" },
];

onMounted(fetchWebhooks);

function openCreateModal() {
	editingWebhook.value = null;
	webhookForm.url = "";
	webhookForm.events = [];
	webhookForm.active = true;
	showCreateModal.value = true;
}

function openEditModal(webhook: Webhook) {
	editingWebhook.value = webhook;
	webhookForm.url = webhook.url;
	webhookForm.events = [...webhook.events];
	webhookForm.active = webhook.active;
	showCreateModal.value = true;
}

async function handleSubmit() {
	if (editingWebhook.value) {
		await updateWebhook(editingWebhook.value.id, webhookForm);
	} else {
		await createWebhook(webhookForm);
	}
	showCreateModal.value = false;
	await fetchWebhooks();
}

async function handleDelete(id: string) {
	if (confirm("Are you sure you want to delete this webhook?")) {
		await deleteWebhook(id);
		await fetchWebhooks();
	}
}

async function handleTest(webhook: Webhook) {
	await testWebhook(webhook.id);
}

function viewDeliveryLogs(webhook: Webhook) {
	selectedWebhook.value = webhook;
	showDeliveryLogs.value = true;
}

function toggleEvent(eventId: string) {
	const index = webhookForm.events.indexOf(eventId);
	if (index > -1) {
		webhookForm.events.splice(index, 1);
	} else {
		webhookForm.events.push(eventId);
	}
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Webhooks</h2>
			<button
				@click="openCreateModal"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				<Icon name="mdi:plus" class="w-4 h-4 mr-2" />
				Create Webhook
			</button>
		</div>

		<div v-if="webhooks.length === 0" class="text-center py-12">
			<Icon name="mdi:webhook" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No webhooks configured</h3>
			<p class="text-gray-600 mb-4">
				Webhooks allow you to receive real-time notifications about events in your account
			</p>
			<button
				@click="openCreateModal"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Create Your First Webhook
			</button>
		</div>

		<div v-else class="space-y-4">
			<WebhookItemWithActions
				v-for="webhook in webhooks"
				:key="webhook.id"
				:webhook="webhook"
				:loading="loading"
				@edit="openEditModal"
				@delete="handleDelete"
				@test="handleTest"
				@view-logs="viewDeliveryLogs"
			/>
		</div>

		<!-- Create/Edit Modal -->
		<div
			v-if="showCreateModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
				<h3 class="text-xl font-bold text-gray-900 mb-4">
					{{ editingWebhook ? "Edit Webhook" : "Create Webhook" }}
				</h3>
				<form @submit.prevent="handleSubmit">
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
							<input
								v-model="webhookForm.url"
								type="url"
								required
								placeholder="https://your-domain.com/webhook"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
										type="checkbox"
										:value="event.id"
										:checked="webhookForm.events.includes(event.id)"
										@change="toggleEvent(event.id)"
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-700">{{ event.label }}</span>
								</label>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<input
								v-model="webhookForm.active"
								type="checkbox"
								id="active"
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label for="active" class="text-sm text-gray-700">Active</label>
						</div>
					</div>
					<div class="flex justify-end gap-3 mt-6">
						<button
							type="button"
							@click="showCreateModal = false"
							class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							:disabled="loading"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{{ loading ? "Saving..." : editingWebhook ? "Update" : "Create" }}
						</button>
					</div>
				</form>
			</div>
		</div>

		<WebhookDeliveryLogsModal
			:show="showDeliveryLogs"
			:webhook="selectedWebhook"
			@close="showDeliveryLogs = false"
		/>
	</div>
</template>
