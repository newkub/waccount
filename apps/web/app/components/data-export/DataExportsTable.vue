<script setup lang="ts">
defineProps<{
	exports: any[];
}>();

const emit = defineEmits<{
	download: [fileUrl: string];
}>();

const getStatusColor = (status: string) => {
	switch (status) {
		case 'pending': return 'bg-yellow-100 text-yellow-800';
		case 'processing': return 'bg-blue-100 text-blue-800';
		case 'completed': return 'bg-green-100 text-green-800';
		case 'failed': return 'bg-red-100 text-red-800';
		default: return 'bg-gray-100 text-gray-800';
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
							ID
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Status
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Format
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Created
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<tr v-for="exp in exports" :key="exp.id">
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{{ exp.id }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							<span
								class="px-2 py-1 text-xs rounded-full"
								:class="getStatusColor(exp.status)"
							>
								{{ exp.status }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{{ exp.format.toUpperCase() }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{{ new Date(exp.createdAt).toLocaleDateString() }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							<button
								v-if="exp.status === 'completed' && exp.fileUrl"
								class="text-indigo-600 hover:text-indigo-900"
								@click="emit('download', exp.fileUrl)"
							>
								Download
							</button>
							<span v-else class="text-gray-400">
								{{ exp.status === 'processing' ? 'Processing...' : 'Pending...' }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
