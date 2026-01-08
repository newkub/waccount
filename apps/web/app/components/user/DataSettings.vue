<script setup lang="ts">
const { signOut } = useAuth();

const emit = defineEmits(["success", "error"]);

const handleExportData = async () => {
	// This would call an API to start data export
	emit("success", "Export started. You will receive an email when ready.");
};

const handleDeleteAccount = async () => {
	if (
		confirm(
			"Are you sure you want to delete your account? This action cannot be undone.",
		)
	) {
		try {
			await signOut();
			// No success emit needed as user will be redirected
		} catch (err) {
			emit("error", (err as Error)?.message || "Failed to delete account");
		}
	}
};
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
			<div>
				<h4 class="font-medium text-gray-900">Data Export</h4>
				<p class="text-sm text-gray-600">Download a copy of your data</p>
			</div>
			<UiButton variant="secondary" @click="handleExportData"
			>Export Data</UiButton>
		</div>
		<div class="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
			<div>
				<h4 class="font-medium text-red-900">Account Deletion</h4>
				<p class="text-sm text-red-700">
					Permanently delete your account and all data
				</p>
			</div>
			<UiButton variant="danger" @click="handleDeleteAccount"
			>Delete Account</UiButton>
		</div>
	</div>
</template>
