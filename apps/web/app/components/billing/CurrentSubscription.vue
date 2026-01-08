<script setup lang="ts">
const { subscription, currentPlan, daysUntilRenewal, changePlan, cancelSubscription, loading } = useBillingFacade();
</script>

<template>
	<div class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Current Plan</h3>
				<p class="text-sm text-gray-600 mt-1">
					{{ currentPlan?.name }} • {{ formatCurrency(subscription?.amount || 0) }}/month
				</p>
			</div>
			<span
				:class="[
					'px-3 py-1 text-sm rounded-full',
					getBillingStatusColor(subscription?.status || 'active'),
				]"
			>
				{{ subscription?.cancelAtPeriodEnd ? "Cancels Soon" : (subscription?.status || "Active") }}
			</span>
		</div>

		<div v-if="subscription && !subscription.cancelAtPeriodEnd" class="mb-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-600">Next billing date</span>
				<span class="font-medium text-gray-900">
					{{ formatDate(subscription.currentPeriodEnd) }}
					<span class="text-gray-500">({{ daysUntilRenewal }} days)</span>
				</span>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<h4 class="font-medium text-gray-900 mb-2">Features Included</h4>
				<ul class="space-y-1">
					<li
						v-for="feature in currentPlan?.features"
						:key="feature"
						class="flex items-center gap-2 text-sm text-gray-600"
					>
						<Icon name="mdi:check-circle" class="w-4 h-4 text-green-600" />
						{{ feature }}
					</li>
				</ul>
			</div>
			<div class="flex items-end">
				<div class="space-y-2 w-full">
					<button
						@click="changePlan('pro')"
						:disabled="loading"
						class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						Change Plan
					</button>
					<button
						v-if="!subscription?.cancelAtPeriodEnd"
						@click="cancelSubscription"
						:disabled="loading"
						class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
					>
						Cancel Subscription
					</button>
					<p v-else class="text-sm text-yellow-600 text-center">
						Subscription will cancel on {{ formatDate(subscription.currentPeriodEnd) }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
