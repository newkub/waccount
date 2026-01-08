<script setup lang="ts">
import type { Kyc } from "~/shared/types";

const props = defineProps<{
	kyc: Kyc;
}>();

const emit = defineEmits<{
	resubmit: [];
}>();

function getStatusColor(status: string) {
	switch (status) {
		case "approved":
			return "bg-green-100 text-green-700";
		case "pending":
			return "bg-yellow-100 text-yellow-700";
		case "under_review":
			return "bg-blue-100 text-blue-700";
		case "rejected":
			return "bg-red-100 text-red-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
}
</script>

<template>
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Icon name="mdi:card-account-details" class="w-6 h-6 text-blue-600" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Verification Status</h3>
					<span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(kyc.status)]">
						{{ kyc.status.replace("_", " ").toUpperCase() }}
					</span>
				</div>
			</div>
			<div v-if="kyc.status === 'rejected'" class="text-right">
				<button
					@click="emit('resubmit')"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Resubmit
				</button>
			</div>
		</div>

		<div class="border-t border-gray-200 pt-4 mt-4">
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<span class="text-gray-600">Document Type:</span>
					<span class="font-medium text-gray-900 ml-2">{{ kyc.documentType }}</span>
				</div>
				<div>
					<span class="text-gray-600">Submitted:</span>
					<span class="font-medium text-gray-900 ml-2">
						{{ new Date(kyc.submittedAt).toLocaleDateString() }}
					</span>
				</div>
			</div>
			<div v-if="kyc.rejectionReason" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-sm text-red-800">
					<strong>Rejection Reason:</strong> {{ kyc.rejectionReason }}
				</p>
			</div>
		</div>
	</div>
</template>
