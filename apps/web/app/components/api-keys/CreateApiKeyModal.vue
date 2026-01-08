<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	newApiKey: string | null;
	loading: boolean;
	apiKeyForm: {
		name: string;
		scopes: string[];
		expiresIn: string;
	};
	availableScopes: Array<{ id: string; label: string; description: string }>;
	expiresInOptions: Array<{ id: string; label: string }>;
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
	toggleScope: [scopeId: string];
	copyKey: [key: string];
}>();
</script>

<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
			<h3 class="text-xl font-bold text-gray-900 mb-4">
				{{ newApiKey ? "Your New API Key" : "Create API Key" }}
			</h3>

			<div v-if="newApiKey" class="mb-4">
				<div class="bg-green-50 border border-green-200 rounded-lg p-4">
					<p class="text-sm text-green-800 mb-2">
						<strong>Important:</strong> Copy this key now. You won't be able to see it again.
					</p>
					<div class="flex items-center gap-2">
						<code class="flex-1 bg-white border border-green-300 rounded px-3 py-2 text-sm font-mono break-all">
							{{ newApiKey }}
						</code>
						<button
							@click="emit('copyKey', newApiKey)"
							class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
						>
							<Icon name="mdi:content-copy" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<form v-else @submit.prevent="emit('submit')">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
						<input
							v-model="apiKeyForm.name"
							type="text"
							required
							placeholder="e.g., Production API Key"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Scopes</label>
						<div class="space-y-2">
							<label
								v-for="scope in availableScopes"
								:key="scope.id"
								class="flex items-start gap-2 cursor-pointer"
							>
								<input
									type="checkbox"
									:value="scope.id"
									:checked="apiKeyForm.scopes.includes(scope.id)"
									@change="emit('toggleScope', scope.id)"
									class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<div>
									<span class="text-sm font-medium text-gray-900">{{ scope.label }}</span>
									<p class="text-xs text-gray-600">{{ scope.description }}</p>
								</div>
							</label>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
						<select
							v-model="apiKeyForm.expiresIn"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option v-for="option in expiresInOptions" :key="option.id" :value="option.id">
								{{ option.label }}
							</option>
						</select>
					</div>
				</div>
				<div class="flex justify-end gap-3 mt-6">
					<button
						type="button"
						@click="emit('close')"
						class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="loading"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						{{ loading ? "Creating..." : "Create" }}
					</button>
				</div>
			</form>

			<div v-if="newApiKey" class="flex justify-end mt-6">
				<button
					@click="emit('close')"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Done
				</button>
			</div>
		</div>
	</div>
</template>
