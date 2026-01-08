<script setup lang="ts">
const { loading, deleteAccount } = useAccountFacade();
const { signOut } = useAuth();

const handleDeleteAccount = async () => {
	await deleteAccount();
	await signOut();
};
</script>

<template>
	<div class="bg-red-50 border border-red-200 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-red-900">Delete Account</p>
					<p class="text-sm text-red-700">
						Permanently delete your account and all data
					</p>
				</div>
				<button
					@click="handleDeleteAccount"
					:disabled="loading"
					class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
				>
					{{ loading ? "Deleting..." : "Delete Account" }}
				</button>
			</div>
		</div>
	</div>
</template>
