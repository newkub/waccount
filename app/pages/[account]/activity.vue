<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const {
	loading,
	filter,
	dateRange,
	fetchActivities,
	filteredActivities,
	exportActivities,
	getActivityStats,
} = useActivityFeed();

const { getActivityIcon, getActivityColor } = useActivity();

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

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			<div class="bg-white rounded-lg border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Total Activities</p>
						<p class="text-2xl font-bold text-gray-900">
							{{ getActivityStats.total }}
						</p>
					</div>
					<Icon name="mdi:chart-line" class="w-8 h-8 text-blue-600" />
				</div>
			</div>
			<div class="bg-white rounded-lg border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Successful</p>
						<p class="text-2xl font-bold text-green-600">
							{{ getActivityStats.successful }}
						</p>
					</div>
					<Icon name="mdi:check-circle" class="w-8 h-8 text-green-600" />
				</div>
			</div>
			<div class="bg-white rounded-lg border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Failed</p>
						<p class="text-2xl font-bold text-red-600">
							{{ getActivityStats.failed }}
						</p>
					</div>
					<Icon name="mdi:alert-circle" class="w-8 h-8 text-red-600" />
				</div>
			</div>
			<div class="bg-white rounded-lg border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Success Rate</p>
						<p class="text-2xl font-bold text-blue-600">
							{{
								getActivityStats.total > 0
								? Math.round(
									(getActivityStats.successful / getActivityStats.total)
										* 100,
								)
								: 0
							}}%
						</p>
					</div>
					<Icon name="mdi:percent" class="w-8 h-8 text-blue-600" />
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
			<div class="flex flex-col md:flex-row gap-4">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 mb-1"
					>Filter by Type</label>
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
					<label class="block text-sm font-medium text-gray-700 mb-1"
					>Date Range</label>
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

		<!-- Activity List -->
		<div class="bg-white rounded-lg border border-gray-200">
			<div class="p-4 border-b border-gray-200">
				<h3 class="font-semibold text-gray-900">Recent Activities</h3>
				<p class="text-sm text-gray-600 mt-1">
					Showing {{ filteredActivities.length }} activities
				</p>
			</div>

			<div v-if="filteredActivities.length === 0" class="text-center py-12">
				<Icon name="mdi:history" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p class="text-gray-600">No activities found</p>
				<p class="text-sm text-gray-500">Try adjusting your filters</p>
			</div>

			<div v-else class="divide-y divide-gray-200">
				<div
					v-for="activity in filteredActivities"
					:key="activity.id"
					class="p-4 hover:bg-gray-50 transition-colors"
				>
					<div class="flex items-start gap-4">
						<div
							class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
							:class="[getActivityColor(activity.type, activity.success)]"
						>
							<Icon
								:name="getActivityIcon(activity.type)"
								class="w-5 h-5"
							/>
						</div>
						<div class="flex-1 min-w-0">
							<div>
								<div class="flex items-center gap-2 mb-1">
									<h4 class="font-medium text-gray-900">
										{{ activity.description }}
									</h4>
									<span class="text-sm text-gray-500">{{
										formatTimestamp(activity.timestamp)
									}}</span>
								</div>
							</div>
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<span class="flex items-center gap-1">
									<Icon name="mdi:ip-network" class="w-4 h-4" />
									{{ activity.ipAddress }}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="mdi:map-marker" class="w-4 h-4" />
									{{ activity.location }}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="mdi:devices" class="w-4 h-4" />
									{{ activity.userAgent.split(" ")[0] }}
								</span>
							</div>
							<div
								v-if="activity.metadata && Object.keys(activity.metadata).length > 0"
								class="mt-2"
							>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="(value, key) in activity.metadata"
										:key="key"
										class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
									>
										{{ key }}: {{ value }}
									</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span
								:class="[
									'px-2 py-1 text-xs rounded-full',
									getActivityColor(activity.type, activity.success),
								]"
							>
								{{ activity.success ? "Success" : "Failed" }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- WorkOS Audit Logs Info -->
		<div class="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
			<div class="flex items-center gap-3 mb-4">
				<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
				<h3 class="text-lg font-semibold text-gray-900">WorkOS Audit Logs</h3>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="flex items-start gap-3">
					<Icon name="mdi:history" class="w-5 h-5 text-green-600 mt-0.5" />
					<div>
						<p class="font-medium text-gray-900">Comprehensive Logging</p>
						<p class="text-sm text-gray-600">
							Track all user activities and system events
						</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<Icon
						name="mdi:shield-account"
						class="w-5 h-5 text-blue-600 mt-0.5"
					/>
					<div>
						<p class="font-medium text-gray-900">Security Monitoring</p>
						<p class="text-sm text-gray-600">
							Real-time security event tracking
						</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<Icon
						name="mdi:database-export"
						class="w-5 h-5 text-purple-600 mt-0.5"
					/>
					<div>
						<p class="font-medium text-gray-900">Export & Compliance</p>
						<p class="text-sm text-gray-600">
							SOC 2, GDPR, and HIPAA compliant
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
