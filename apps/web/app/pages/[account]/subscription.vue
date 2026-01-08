<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { subscription, loading, fetchSubscription } = useSubscriptionFacade();

onMounted(fetchSubscription);

function getStatusColor(status: string) {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-700";
		case "trialing":
			return "bg-blue-100 text-blue-700";
		case "past_due":
			return "bg-yellow-100 text-yellow-700";
		case "canceled":
			return "bg-red-100 text-red-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Subscription</h2>
		</div>

		<div v-if="!subscription" class="text-center py-12">
			<Icon name="mdi:credit-card-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No active subscription</h3>
			<p class="text-gray-600 mb-4">Upgrade your account to access premium features</p>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				View Plans
			</button>
		</div>

		<div v-else class="space-y-6">
			<div class="bg-white rounded-lg border border-gray-200 p-6">
				<div class="flex items-center justify-between mb-4">
					<div>
						<div class="flex items-center gap-3 mb-2">
							<h3 class="text-lg font-semibold text-gray-900">Current Plan</h3>
							<span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(subscription.status)]">
								{{ subscription.status }}
							</span>
						</div>
						<div class="text-3xl font-bold text-gray-900">
							{{ subscription.currency }} {{ subscription.amount.toFixed(2) }}
							<span class="text-lg font-normal text-gray-600">/{{ subscription.interval }}</span>
						</div>
					</div>
					<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Change Plan
					</button>
				</div>

				<div class="border-t border-gray-200 pt-4 mt-4">
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							span class="text-gray-600">Period Start:</span>
							<span class="font-medium text-gray-900 ml-2">
								{{ new Date(subscription.currentPeriodStart).toLocaleDateString() }}
							</span>
						</div>
						<div>
							<span class="text-gray-600">Period End:</span>
							span class="font-medium text-gray-900 ml-2">
								{{ new Date(subscription.currentPeriodEnd).toLocaleDateString() }}
							</span>
						</div>
					</div>
				</div>

				<div v-if="subscription.features.length > 0" class="mt-4">
					<h4 class="text-sm font-medium text-gray-900 mb-2">Included Features</h4>
					<ul class="space-y-1">
						li v-for="feature in subscription.features" :key="feature" class="flex items-center gap-2 text-sm text-gray-600">
							<Icon name="mdi:check" class="w-4 h-4 text-green-600" />
							{{ feature }}
						</li>
					</ul>
				</div>
			</div>

			<div v-if="subscription.cancelAtPeriodEnd" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<Icon name="mdi:alert" class="w-5 h-5 text-yellow-600 mt-0.5" />
					<div>
						<h4 class="font-semibold text-yellow-900">Subscription Canceled</h4>
						<p class="text-sm text-yellow-700 mt-1">
							Your subscription will be canceled at the end of the current billing period.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
