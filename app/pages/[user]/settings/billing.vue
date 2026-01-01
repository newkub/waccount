<script setup lang="ts">
const { user } = useAuth();
const {
	loading,
	subscription,
	invoices,
	usage,
	planOptions,
	fetchBillingData,
	currentPlan,
	daysUntilRenewal,
	changePlan,
	cancelSubscription,
	downloadInvoice,
} = useBillingFacade();

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
			<!-- Current Subscription -->
			<div class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between mb-4">
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Current Plan</h3>
						<p class="text-sm text-gray-600 mt-1">
							{{ currentPlan?.name }} • {{
								formatCurrency(subscription?.amount || 0)
							}}/month
						</p>
					</div>
					<span
						:class="[
							'px-3 py-1 text-sm rounded-full',
							getBillingStatusColor(subscription?.status || 'active'),
						]"
					>
						{{
							subscription?.cancelAtPeriodEnd
							? "Cancels Soon"
							: (subscription?.status || "Active")
						}}
					</span>
				</div>

				<div
					v-if="subscription && !subscription.cancelAtPeriodEnd"
					class="mb-4"
				>
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
								Subscription will cancel on {{
									formatDate(subscription.currentPeriodEnd)
								}}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Usage Metrics -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">
					Usage This Month
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div v-for="(metric, key) in usage" :key="key" class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-900 capitalize">{{
								key
							}}</span>
							<span class="text-sm text-gray-600">
								{{ metric.current }} {{
									metric.limit !== "unlimited" ? `/ ${metric.limit}` : ""
								}}
							</span>
						</div>
						<div
							v-if="metric.limit !== 'unlimited'"
							class="w-full bg-gray-200 rounded-full h-2"
						>
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

			<!-- Plan Options -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">
					Available Plans
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div
						v-for="plan in planOptions"
						:key="plan.id"
						:class="[
							'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
							plan.id === subscription?.plan
								? 'border-blue-500 shadow-md'
								: 'border-gray-200',
						]"
					>
						<div v-if="plan.popular" class="mb-2">
							<span
								class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
							>Most Popular</span>
						</div>
						<h4 class="font-semibold text-gray-900 text-lg">{{ plan.name }}</h4>
						<p class="text-2xl font-bold text-gray-900 mt-1">
							{{ formatCurrency(plan.price) }}/month
						</p>

						<ul class="mt-4 space-y-2">
							<li
								v-for="feature in plan.features"
								:key="feature"
								class="flex items-start gap-2 text-sm text-gray-600"
							>
								<Icon
									name="mdi:check"
									class="w-4 h-4 text-green-600 mt-0.5 shrink-0"
								/>
								{{ feature }}
							</li>
						</ul>

						<button
							v-if="plan.id !== subscription?.plan"
							@click="changePlan(plan.id)"
							:disabled="loading"
							class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{{
								plan.price > (subscription?.amount || 0)
								? "Upgrade"
								: "Downgrade"
							}}
						</button>
						<div
							v-else
							class="w-full mt-4 px-4 py-2 bg-green-100 text-green-700 text-center rounded-lg"
						>
							Current Plan
						</div>
					</div>
				</div>
			</div>

			<!-- Billing History -->
			<div class="bg-gray-50 rounded-lg p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Billing History</h3>
					<button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
						View All
					</button>
				</div>

				<div class="space-y-3">
					<div
						v-for="invoice in invoices"
						:key="invoice.id"
						class="bg-white rounded-lg border border-gray-200 p-4"
					>
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-medium text-gray-900">
									{{ invoice.description }}
								</h4>
								<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
									<span>{{ formatDate(invoice.date) }}</span>
									<span
										:class="[
											'px-2 py-1 text-xs rounded-full',
											getBillingStatusColor(invoice.status),
										]"
									>
										{{ invoice.status }}
									</span>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<span class="font-semibold text-gray-900">{{
									formatCurrency(invoice.amount)
								}}</span>
								<button
									@click="downloadInvoice(invoice.id)"
									class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
									title="Download invoice"
								>
									<Icon name="mdi:download" class="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- WorkOS Billing Info -->
			<div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center gap-3 mb-4">
					<Icon name="mdi:credit-card" class="w-6 h-6 text-blue-600" />
					<h3 class="text-lg font-semibold text-gray-900">
						WorkOS Billing Features
					</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="flex items-start gap-3">
						<Icon
							name="mdi:receipt-text"
							class="w-5 h-5 text-green-600 mt-0.5"
						/>
						<div>
							<p class="font-medium text-gray-900">Automated Invoicing</p>
							<p class="text-sm text-gray-600">
								Generate and send invoices automatically
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="mdi:bank" class="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<p class="font-medium text-gray-900">Multiple Payment Methods</p>
							<p class="text-sm text-gray-600">
								Credit cards, ACH, wire transfers
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon
							name="mdi:file-chart"
							class="w-5 h-5 text-purple-600 mt-0.5"
						/>
						<div>
							<p class="font-medium text-gray-900">Usage Analytics</p>
							<p class="text-sm text-gray-600">
								Track and analyze usage patterns
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
