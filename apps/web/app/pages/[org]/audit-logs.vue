<script setup lang="ts">
import type { AuditLogsExportRequest } from "~/shared/types";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const org = computed(() => String(route.params.org ?? ""));

const now = new Date();
const defaultEnd = new Date(now.getTime());
const defaultStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const toDateTimeLocal = (d: Date) => {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${
		pad(d.getHours())
	}:${pad(d.getMinutes())}`;
};

const rangeStart = ref<string>(toDateTimeLocal(defaultStart));
const rangeEnd = ref<string>(toDateTimeLocal(defaultEnd));

const loading = ref(false);
const error = ref<string | null>(null);
const exportResult = ref<unknown | null>(null);

const submitExport = async () => {
	error.value = null;
	exportResult.value = null;
	loading.value = true;
	try {
		const body: AuditLogsExportRequest = {
			rangeStart: new Date(rangeStart.value).toISOString(),
			rangeEnd: new Date(rangeEnd.value).toISOString(),
		};
		const result = await $fetch(`/api/orgs/${org.value}/audit-logs/export`, {
			method: "POST",
			body,
		});
		exportResult.value = result;
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e);
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				Audit Logs
			</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Export Audit Logs for <code>{{ org }}</code>
			</p>
		</div>

		<UiCard class="p-6">
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-200"
					>
						Range start
					</label>
					<div class="mt-1">
						<UiInput v-model="rangeStart" type="datetime-local" />
					</div>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-200"
					>
						Range end
					</label>
					<div class="mt-1">
						<UiInput v-model="rangeEnd" type="datetime-local" />
					</div>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-3">
				<UiButton :loading="loading" @click="submitExport()">
					Create export
				</UiButton>
				<UiButton
					variant="secondary"
					:disabled="loading"
					@click="exportResult = null;
					error = null;"
				>
					Clear
				</UiButton>
			</div>

			<div v-if="error" class="mt-4">
				<p class="text-red-600">{{ error }}</p>
			</div>
		</UiCard>

		<UiCard v-if="exportResult" class="p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
				Export Result
			</h2>
			<div class="mt-3 text-sm text-gray-700 dark:text-gray-200">
				<pre class="whitespace-pre-wrap break-words">{{ exportResult }}</pre>
			</div>
		</UiCard>
	</div>
</template>
