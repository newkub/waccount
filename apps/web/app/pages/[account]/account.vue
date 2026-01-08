<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { preferences, fetchAccountData } = useAccountFacade();

onMounted(fetchAccountData);
</script>

<template>
	<div>
		<h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

		<div v-if="preferences" class="space-y-6">
			<AccountInformation />
			<AccountPreferences />
			<OrganizationAccess />
			<AccountDangerZone />

			<!-- Actions -->
			<div class="flex gap-4">
				<button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Save Changes
				</button>
				<button class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
