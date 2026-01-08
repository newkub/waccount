<script setup lang="ts">
const { getActivityStats } = useActivityFeed();
</script>

<template>
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
								(getActivityStats.successful / getActivityStats.total) * 100,
							)
							: 0
						}}%
					</p>
				</div>
				<Icon name="mdi:percent" class="w-8 h-8 text-blue-600" />
			</div>
		</div>
	</div>
</template>
