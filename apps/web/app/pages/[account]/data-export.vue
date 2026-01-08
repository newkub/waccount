<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getExports, createExport, loading } = useDataExport();

const exports = ref<any[]>([]);
const showCreateModal = ref(false);
const selectedFormat = ref<"json" | "csv">("json");
const selectedInclude = ref<string[]>(["profile", "organizations", "billing"]);

onMounted(async () => {
	try {
		const response = await getExports();
		exports.value = response.exports || [];
	} catch (error) {
		console.error("Failed to fetch exports:", error);
	}
});

const handleCreateExport = async () => {
	try {
		const response = await createExport(selectedFormat.value, selectedInclude.value);
		exports.value.unshift(response);
		showCreateModal.value = false;
	} catch (error) {
		console.error("Failed to create export:", error);
	}
};

const handleDownload = (fileUrl: string) => {
	window.open(fileUrl, "_blank");
};

const toggleInclude = (value: string) => {
	const index = selectedInclude.value.indexOf(value);
	if (index > -1) {
		selectedInclude.value.splice(index, 1);
	} else {
		selectedInclude.value.push(value);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold">Data Export</h1>
				<p class="text-gray-600 dark:text-gray-400">
					Export your data in JSON or CSV format
				</p>
			</div>
			<button
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
				@click="showCreateModal = true"
			>
				Create Export
			</button>
		</div>

		<DataExportsTable :exports="exports" @download="handleDownload" />

		<CreateExportModal
			:show="showCreateModal"
			:loading="loading"
			:selected-format="selectedFormat"
			:selected-include="selectedInclude"
			@close="showCreateModal = false"
			@submit="handleCreateExport"
			@toggle-include="toggleInclude"
		/>
	</div>
</template>
