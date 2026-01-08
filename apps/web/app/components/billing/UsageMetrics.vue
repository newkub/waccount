<script setup lang="ts">
const { usage } = useBillingFacade();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">
			Usage This Month
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div v-for="(metric, key) in usage" :key="key" class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="font-medium text-gray-900 capitalize">{{ key }}</span>
					<span class="text-sm text-gray-600">
						{{ metric.current }} {{ metric.limit !== "unlimited" ? `/ ${metric.limit}` : "" }}
					</span>
				</div>
				<div v-if="metric.limit !== 'unlimited'" class="w-full bg-gray-200 rounded-full h-2">
					<div
						:class="[
							'h-2 rounded-full transition-all',
							getUsageColor(metric.percentage),
						]"
						:style="{ width: `${metric.percentage}%` }"
					>
					</div>
				</div>
				<div v-else class="text-sm text-green-600">
					<Icon name="mdi:infinity" class="w-4 h-4 inline" />
					Unlimited
				</div>
			</div>
		</div>
	</div>
</template>
