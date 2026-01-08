<template>
	<div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:credit-card" class="w-6 h-6 text-blue-600" />
			<h3 class="text-lg font-semibold text-gray-900">
				WorkOS Billing Features
			</h3>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="flex items-start gap-3">
				<Icon name="mdi:receipt-text" class="w-5 h-5 text-green-600 mt-0.5" />
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
				<Icon name="mdi:file-chart" class="w-5 h-5 text-purple-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Usage Analytics</p>
					<p class="text-sm text-gray-600">
						Track and analyze usage patterns
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
