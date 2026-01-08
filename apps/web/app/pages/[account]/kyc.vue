<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { kyc, loading, fetchKyc, submitKyc } = useKycFacade();

const showForm = ref(false);
const kycForm = reactive({
	documentType: "passport",
	documentNumber: "",
	documentFrontUrl: "",
	documentBackUrl: "",
	selfieUrl: "",
});

const documentTypes = [
	{ id: "passport", label: "Passport" },
	{ id: "id_card", label: "ID Card" },
	{ id: "driving_license", label: "Driving License" },
];

onMounted(fetchKyc);

function openForm() {
	kycForm.documentType = "passport";
	kycForm.documentNumber = "";
	kycForm.documentFrontUrl = "";
	kycForm.documentBackUrl = "";
	kycForm.selfieUrl = "";
	showForm.value = true;
}

async function handleSubmit() {
	await submitKyc(kycForm);
	showForm.value = false;
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Identity Verification</h2>
			<button
				v-if="!kyc || kyc.status === 'rejected'"
				@click="openForm"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Start Verification
			</button>
		</div>

		<KycEmptyState v-if="!kyc" v-model="showForm" />

		<div v-else class="space-y-6">
			<KycStatusCard :kyc="kyc" @resubmit="openForm" />

			<KycSuccessMessage v-if="kyc.status === 'approved'" />
		</div>

		<KycFormModal
			:show="showForm"
			:loading="loading"
			:kyc-form="kycForm"
			:document-types="documentTypes"
			@close="showForm = false"
			@submit="handleSubmit"
		/>
	</div>
</template>
