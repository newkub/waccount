<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getUsage, loading } = useUsage();

const usage = ref<any>(null);

onMounted(async () => {
	try {
		const response = await getUsage();
		usage.value = response.usage;
	} catch (error) {
		console.error("Failed to fetch usage:", error);
	}
});

const getPercentageColor = (percentage: number) => {
	if (percentage >= 90) return "bg-red-500";
	if (percentage >= 70) return "bg-yellow-500";
	return "bg-green-500";
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold">Usage Dashboard</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Monitor your resource usage and limits
			</p>
		</div>

		<div v-if="usage" class="grid gap-6 md:grid-cols-2">
			<div
				v-for="(metric, key) in usage"
				:key="key"
				class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
			>
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold capitalize">{{ key }}</h3>
					<span class="text-sm text-gray-600 dark:text-gray-400">
						{{ metric.current }} / {{ metric.limit }}
					</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
					<div
						class="h-2 rounded-full transition-all"
						:class="getPercentageColor(metric.percentage)"
						:style="{ width: `${metric.percentage}%` }"
					></div>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
					{{ metric.percentage }}% used
				</p>
			</div>
		</div>
	</div>
</template>
