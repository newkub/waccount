<script setup lang="ts">
const { filteredActivities } = useActivityFeed();
const { getActivityIcon, getActivityColor } = useActivity();
</script>

<template>
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
						<Icon :name="getActivityIcon(activity.type)" class="w-5 h-5" />
					</div>
					<div class="flex-1 min-w-0">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<h4 class="font-medium text-gray-900">
									{{ activity.description }}
								</h4>
								<span class="text-sm text-gray-500">{{ formatTimestamp(activity.timestamp) }}</span>
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
</template>
