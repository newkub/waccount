<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { loading, fetchActivities, exportActivities } = useActivityFeed();

onMounted(fetchActivities);
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Activity Log</h2>
			<button
				@click="exportActivities"
				:disabled="loading"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
			>
				<Icon name="mdi:download" class="w-4 h-4 mr-2" />
				Export Log
			</button>
		</div>

		<ActivityStats />
		<ActivityFilters />
		<ActivityList />
		<WorkOSAuditLogsInfo />
	</div>
</template>
