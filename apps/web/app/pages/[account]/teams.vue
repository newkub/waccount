<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { fetchTeamsData } = useTeamsFacade();

onMounted(fetchTeamsData);
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Teams & Organizations</h2>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<Icon name="mdi:plus" class="w-4 h-4 mr-2" />
				Create Team
			</button>
		</div>

		<div class="space-y-6">
			<OrganizationsSection />
			<PendingInvitationsSection />
			<WorkOSFeaturesSection />
		</div>
	</div>
</template>
