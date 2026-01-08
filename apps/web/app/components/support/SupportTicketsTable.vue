<script setup lang="ts">
const props = defineProps<{
	tickets: any[];
}>();

const getStatusColor = (status: string) => {
	switch (status) {
		case "open": return "bg-blue-100 text-blue-800";
		case "in_progress": return "bg-yellow-100 text-yellow-800";
		case "resolved": return "bg-green-100 text-green-800";
		case "closed": return "bg-gray-100 text-gray-800";
		default: return "bg-gray-100 text-gray-800";
	}
};

const getPriorityColor = (priority: string) => {
	switch (priority) {
		case "low": return "bg-gray-100 text-gray-800";
		case "medium": return "bg-blue-100 text-blue-800";
		case "high": return "bg-orange-100 text-orange-800";
		case "urgent": return "bg-red-100 text-red-800";
		default: return "bg-gray-100 text-gray-800";
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 dark:bg-gray-700">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Subject
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Status
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Priority
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Category
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Created
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<tr v-for="ticket in tickets" :key="ticket.id">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							{{ ticket.subject }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							<span
								class="px-2 py-1 text-xs rounded-full"
								:class="getStatusColor(ticket.status)"
							>
								{{ ticket.status }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							<span
								class="px-2 py-1 text-xs rounded-full"
								:class="getPriorityColor(ticket.priority)"
							>
								{{ ticket.priority }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{{ ticket.category }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{{ new Date(ticket.createdAt).toLocaleDateString() }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
