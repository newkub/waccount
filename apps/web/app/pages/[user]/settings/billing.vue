<script setup lang="ts">
const { user } = useAuth();
const { fetchBillingData } = useBillingFacade();

onMounted(fetchBillingData);
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<Icon name="mdi:credit-card-plus" class="w-4 h-4 mr-2" />
				Upgrade Plan
			</button>
		</div>

		<div class="space-y-6">
			<CurrentSubscription />
			<UsageMetrics />
			<PlanOptions />
			<BillingHistory />
			<WorkOSBillingInfo />
		</div>
	</div>
</template>
