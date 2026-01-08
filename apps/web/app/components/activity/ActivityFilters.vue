<script setup lang="ts">
const { filter, dateRange } = useActivityFeed();
</script>

<template>
	<div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1">
				<label class="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
				<select
					v-model="filter"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="all">All Activities</option>
					<option value="login">Login/Logout</option>
					<option value="password">Password</option>
					<option value="profile">Profile</option>
					<option value="organization">Organization</option>
					<option value="security">Security</option>
					<option value="connection">Connections</option>
				</select>
			</div>
			<div class="flex-1">
				<label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
				<select
					v-model="dateRange"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="7d">Last 7 days</option>
					<option value="30d">Last 30 days</option>
					<option value="90d">Last 90 days</option>
					<option value="365d">Last year</option>
				</select>
			</div>
		</div>
	</div>
</template>
