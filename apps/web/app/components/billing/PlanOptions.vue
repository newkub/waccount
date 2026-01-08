<script setup lang="ts">
const { subscription, planOptions, changePlan, loading } = useBillingFacade();
</script>

<template>
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
					plan.id === subscription?.plan ? 'border-blue-500 shadow-md' : 'border-gray-200',
				]"
			>
				<div v-if="plan.popular" class="mb-2">
					<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Most Popular</span>
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
						<Icon name="mdi:check" class="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
						{{ feature }}
					</li>
				</ul>

				<button
					v-if="plan.id !== subscription?.plan"
					@click="changePlan(plan.id)"
					:disabled="loading"
					class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					{{ plan.price > (subscription?.amount || 0) ? "Upgrade" : "Downgrade" }}
				</button>
				<div v-else class="w-full mt-4 px-4 py-2 bg-green-100 text-green-700 text-center rounded-lg">
					Current Plan
				</div>
			</div>
		</div>
	</div>
</template>
