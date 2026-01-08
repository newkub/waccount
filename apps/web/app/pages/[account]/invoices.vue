<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { invoices, loading, fetchInvoices } = useInvoicesFacade();

onMounted(fetchInvoices);

function getStatusColor(status: string) {
	switch (status) {
		case "paid":
			return "bg-green-100 text-green-700";
		case "pending":
			return "bg-yellow-100 text-yellow-700";
		case "failed":
			return "bg-red-100 text-red-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Invoices</h2>
		</div>

		<div v-if="invoices.length === 0" class="text-center py-12">
			<Icon name="mdi:receipt" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
			<p class="text-gray-600">Your invoices will appear here</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="invoice in invoices"
				:key="invoice.id"
				class="bg-white rounded-lg border border-gray-200 p-6"
			>
				<div class="flex items-center justify-between">
					<div>
						<div class="flex items-center gap-3 mb-2">
							<h3 class="text-lg font-semibold text-gray-900">Invoice #{{ invoice.id.slice(-8) }}</h3>
							<span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(invoice.status)]">
								{{ invoice.status }}
							</span>
						</div>
						<p class="text-sm text-gray-600 mb-2">{{ invoice.description }}</p>
						div class="text-sm text-gray-500">
							Date: {{ new Date(invoice.date).toLocaleDateString() }}
						</div>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold text-gray-900">
							{{ invoice.currency }} {{ invoice.amount.toFixed(2) }}
						</div>
						<a
							:href="invoice.downloadUrl"
							target="_blank"
							class="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-sm"
						>
							<Icon name="mdi:download" class="w-4 h-4" />
							Download
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
