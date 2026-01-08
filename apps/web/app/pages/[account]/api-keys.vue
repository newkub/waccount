<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { apiKeys, loading, fetchApiKeys, createApiKey, deleteApiKey, regenerateApiKey } = useApiKeysFacade();

const showCreateModal = ref(false);
const newApiKey = ref<string | null>(null);

const apiKeyForm = reactive({
	name: "",
	scopes: ["read"],
	expiresIn: "never",
});

const availableScopes = [
	{ id: "read", label: "Read", description: "Read access to your data" },
	{ id: "write", label: "Write", description: "Modify your data" },
	{ id: "delete", label: "Delete", description: "Delete your data" },
	{ id: "admin", label: "Admin", description: "Full administrative access" },
];

const expiresInOptions = [
	{ id: "never", label: "Never" },
	{ id: "30d", label: "30 Days" },
	{ id: "90d", label: "90 Days" },
	{ id: "1y", label: "1 Year" },
];

onMounted(fetchApiKeys);

function openCreateModal() {
	apiKeyForm.name = "";
	apiKeyForm.scopes = ["read"];
	apiKeyForm.expiresIn = "never";
	newApiKey.value = null;
	showCreateModal.value = true;
}

async function handleSubmit() {
	let expiresAt: string | undefined;
	if (apiKeyForm.expiresIn !== "never") {
		const now = new Date();
		if (apiKeyForm.expiresIn === "30d") now.setDate(now.getDate() + 30);
		if (apiKeyForm.expiresIn === "90d") now.setDate(now.getDate() + 90);
		if (apiKeyForm.expiresIn === "1y") now.setFullYear(now.getFullYear() + 1);
		expiresAt = now.toISOString();
	}

	const result = await createApiKey({
		name: apiKeyForm.name,
		scopes: apiKeyForm.scopes,
		expiresAt,
	});

	if (result?.apiKey) {
		newApiKey.value = result.apiKey;
	}
}

async function handleDelete(id: string) {
	if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
		await deleteApiKey(id);
	}
}

async function handleRegenerate(id: string) {
	if (confirm("Are you sure you want to regenerate this API key? The old key will be invalidated immediately.")) {
		await regenerateApiKey(id);
	}
}

function toggleScope(scopeId: string) {
	const index = apiKeyForm.scopes.indexOf(scopeId);
	if (index > -1) {
		apiKeyForm.scopes.splice(index, 1);
	} else {
		apiKeyForm.scopes.push(scopeId);
	}
}

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">API Keys</h2>
			<button
				@click="openCreateModal"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				<Icon name="mdi:plus" class="w-4 h-4 mr-2" />
				Create API Key
			</button>
		</div>

		<ApiKeySecurityAlert />

		<ApiKeyEmptyState v-if="apiKeys.length === 0" v-model="showCreateModal" />

		<div v-else class="space-y-4">
			<ApiKeyItem
				v-for="apiKey in apiKeys"
				:key="apiKey.id"
				:api-key="apiKey"
				:loading="loading"
				@regenerate="handleRegenerate"
				@delete="handleDelete"
			/>
		</div>

		<CreateApiKeyModal
			:show="showCreateModal"
			:new-api-key="newApiKey"
			:loading="loading"
			:api-key-form="apiKeyForm"
			:available-scopes="availableScopes"
			:expires-in-options="expiresInOptions"
			@close="showCreateModal = false"
			@submit="handleSubmit"
			@toggle-scope="toggleScope"
			@copy-key="copyToClipboard"
		/>
	</div>
</template>
