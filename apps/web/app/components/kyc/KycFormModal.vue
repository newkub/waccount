<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	loading: boolean;
	kycForm: {
		documentType: string;
		documentNumber: string;
		documentFrontUrl: string;
		documentBackUrl: string;
		selfieUrl: string;
	};
	documentTypes: Array<{ id: string; label: string }>;
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
}>();
</script>

<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
			<h3 class="text-xl font-bold text-gray-900 mb-4">Submit Identity Documents</h3>
			<form @submit.prevent="emit('submit')">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
						<select
							v-model="kycForm.documentType"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option v-for="type in documentTypes" :key="type.id" :value="type.id">
								{{ type.label }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
						<input
							v-model="kycForm.documentNumber"
							type="text"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Document Front (URL)</label>
						<input
							v-model="kycForm.documentFrontUrl"
							type="url"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div v-if="kycForm.documentType !== 'passport'">
						<label class="block text-sm font-medium text-gray-700 mb-1">Document Back (URL)</label>
						<input
							v-model="kycForm.documentBackUrl"
							type="url"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Selfie (URL)</label>
						<input
							v-model="kycForm.selfieUrl"
							type="url"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
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
						{{ loading ? "Submitting..." : "Submit" }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
