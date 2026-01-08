<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getVerifications, createVerification, loading } = useVerification();

const verifications = ref<any[]>([]);
const showVerifyModal = ref(false);
const selectedType = ref<"email" | "phone" | "identity" | "business">("email");

onMounted(async () => {
	try {
		const response = await getVerifications();
		verifications.value = response.verifications || [];
	} catch (error) {
		console.error("Failed to fetch verifications:", error);
	}
});

const handleCreateVerification = async () => {
	try {
		const response = await createVerification(selectedType.value, {});
		verifications.value.unshift(response);
		showVerifyModal.value = false;
	} catch (error) {
		console.error("Failed to create verification:", error);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold">Account Verification</h1>
				<p class="text-gray-600 dark:text-gray-400">
					Verify your identity and account information
				</p>
			</div>
			<button
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
				@click="showVerifyModal = true"
			>
				Start Verification
			</button>
		</div>

		<div class="grid gap-4">
			<div
				v-for="verification in verifications"
				:key="verification.id"
				class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
			>
				<div class="flex justify-between items-start">
					<div>
						<h3 class="text-lg font-semibold capitalize">
							{{ verification.type }} Verification
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{{ verification.data?.email || verification.data?.phone || 'No details' }}
						</p>
					</div>
					<span
						class="px-3 py-1 text-xs font-medium rounded-full"
						:class="{
							'bg-yellow-100 text-yellow-800': verification.status === 'pending',
							'bg-green-100 text-green-800': verification.status === 'verified',
							'bg-red-100 text-red-800': verification.status === 'failed',
						}"
					>
						{{ verification.status }}
					</span>
				</div>
				<div v-if="verification.verifiedAt" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
					Verified on: {{ new Date(verification.verifiedAt).toLocaleDateString() }}
				</div>
			</div>
		</div>

		<div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
				<h2 class="text-xl font-bold mb-4">Start Verification</h2>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Verification Type</label>
						<select v-model="selectedType" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="identity">Identity</option>
							<option value="business">Business</option>
						</select>
					</div>
				</div>
				<div class="flex justify-end gap-2 mt-6">
					<button
						class="px-4 py-2 text-gray-600 hover:text-gray-900"
						@click="showVerifyModal = false"
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
						:disabled="loading"
						@click="handleCreateVerification"
					>
						Start
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
