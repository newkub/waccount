<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getRecovery, updateRecovery, addTrustedContact, loading } = useRecovery();

const recovery = ref<any>(null);
const showAddContactModal = ref(false);
const contactForm = reactive({
	name: "",
	email: "",
	relationship: "",
});

onMounted(async () => {
	try {
		const response = await getRecovery();
		recovery.value = response.recovery;
	} catch (error) {
		console.error("Failed to fetch recovery settings:", error);
	}
});

const handleUpdateRecoveryEmail = async (email: string) => {
	try {
		await updateRecovery(email);
		if (recovery.value) {
			recovery.value.recoveryEmail = email;
		}
	} catch (error) {
		console.error("Failed to update recovery email:", error);
	}
};

const handleAddTrustedContact = async () => {
	try {
		const response = await addTrustedContact(contactForm.name, contactForm.email, contactForm.relationship);
		if (recovery.value) {
			recovery.value.trustedContacts.push(response);
		}
		showAddContactModal.value = false;
		contactForm.name = "";
		contactForm.email = "";
		contactForm.relationship = "";
	} catch (error) {
		console.error("Failed to add trusted contact:", error);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold">Account Recovery</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Manage your account recovery options
			</p>
		</div>

		<div v-if="recovery" class="space-y-6">
			<RecoveryEmailSection
				:recovery-email="recovery.recoveryEmail"
				@update="handleUpdateRecoveryEmail"
			/>

			<BackupCodesSection
				:recovery-codes="recovery.recoveryCodes"
				@generate=""
			/>

			<TrustedContactsSection
				:trusted-contacts="recovery.trustedContacts"
				@add-contact="showAddContactModal = true"
			/>
		</div>

		<AddContactModal
			:show="showAddContactModal"
			:loading="loading"
			:form="contactForm"
			@close="showAddContactModal = false"
			@submit="handleAddTrustedContact"
		/>
	</div>
</template>
