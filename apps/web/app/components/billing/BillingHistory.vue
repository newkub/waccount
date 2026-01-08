<script setup lang="ts">
const { invoices, downloadInvoice } = useBillingFacade();
</script>

<template>
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
						<span class="font-semibold text-gray-900">{{ formatCurrency(invoice.amount) }}</span>
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
</template>
