<script setup lang="ts">
import type { Webhook } from "~/shared/types";

const { getWebhooks, createWebhook, updateWebhook, deleteWebhook, loading, error } = useWebhooks();

const webhooks = ref<Webhook[]>([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingWebhook = ref<Webhook | null>(null);

const fetchWebhooks = async () => {
	try {
		webhooks.value = await getWebhooks();
	} catch (err) {
		console.error("Failed to fetch webhooks:", err);
	}
};

const handleCreateWebhook = async (data: Partial<Webhook>) => {
	try {
		const webhook = await createWebhook(data);
		webhooks.value.push(webhook);
		showCreateModal.value = false;
	} catch (err) {
		console.error("Failed to create webhook:", err);
	}
};

const handleUpdateWebhook = async (data: Partial<Webhook>) => {
	if (!editingWebhook.value) return;
	try {
		const updated = await updateWebhook(editingWebhook.value.id, data);
		const index = webhooks.value.findIndex((w) => w.id === updated.id);
		if (index !== -1) {
			webhooks.value[index] = updated;
		}
		showEditModal.value = false;
		editingWebhook.value = null;
	} catch (err) {
		console.error("Failed to update webhook:", err);
	}
};

const handleDeleteWebhook = async (id: string) => {
	if (!confirm("Are you sure you want to delete this webhook?")) return;
	try {
		await deleteWebhook(id);
		webhooks.value = webhooks.value.filter((w) => w.id !== id);
	} catch (err) {
		console.error("Failed to delete webhook:", err);
	}
};

const openEditModal = (webhook: Webhook) => {
	editingWebhook.value = { ...webhook };
	showEditModal.value = true;
};

const toggleWebhookActive = async (webhook: Webhook) => {
	try {
		const updated = await updateWebhook(webhook.id, { active: !webhook.active });
		const index = webhooks.value.findIndex((w) => w.id === updated.id);
		if (index !== -1) {
			webhooks.value[index] = updated;
		}
	} catch (err) {
		console.error("Failed to toggle webhook:", err);
	}
};

onMounted(() => {
	fetchWebhooks();
});
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Webhooks</h2>
				<p class="text-sm text-gray-600 mt-1">
					Manage webhooks to receive real-time notifications
				</p>
			</div>
			<button
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
				@click="showCreateModal = true"
			>
				<i class="i-mdi-plus"></i>
				Add Webhook
			</button>
		</div>

		<div v-if="loading.value" class="flex items-center justify-center py-12">
			<i class="i-mdi-loading animate-spin text-4xl text-blue-600"></i>
		</div>

		<div v-else-if="error.value" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
			{{ error.value }}
		</div>

		<WebhookEmptyState v-else-if="webhooks.length === 0" v-model="showCreateModal" />

		<div v-else class="space-y-4">
			<WebhookItem
				v-for="webhook in webhooks"
				:key="webhook.id"
				:webhook="webhook"
				@toggle="toggleWebhookActive"
				@edit="openEditModal"
				@delete="handleDeleteWebhook"
			/>
		</div>

		<WebhookModal
			:show="showCreateModal"
			mode="create"
			@close="showCreateModal = false"
			@save="handleCreateWebhook"
		/>

		<WebhookModal
			:show="showEditModal"
			mode="edit"
			:webhook="editingWebhook"
			@close="showEditModal = false"
			@save="handleUpdateWebhook"
		/>
	</div>
</template>
