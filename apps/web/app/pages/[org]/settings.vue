<script setup lang="ts">
import { ofetch } from "ofetch";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const org = computed(() => String(route.params.org ?? ""));

type OrgDashboardLayoutResponse = {
	orgExternalId: string;
	userId: string;
	layout: {
		version: number;
		tabs: Array<
			{
				id: string;
				label: string;
				hidden?: boolean;
				slots: Array<{ id: string; type: string }>;
			}
		>;
	};
};

const { data, pending, error, refresh } = useFetch<OrgDashboardLayoutResponse>(
	() => `/api/orgs/${org.value}/dashboard-layout`,
);

const workingLayout = ref<OrgDashboardLayoutResponse["layout"] | null>(null);

watch(
	() => data.value?.layout,
	(layout) => {
		if (!layout) return;
		workingLayout.value = structuredClone(layout);
	},
	{ immediate: true },
);

const saving = ref(false);
const saveError = ref<string | null>(null);
const saveSuccess = ref<string | null>(null);

const save = async () => {
	if (!workingLayout.value) return;
	saveError.value = null;
	saveSuccess.value = null;
	saving.value = true;
	try {
		await ofetch(`/api/orgs/${org.value}/dashboard-layout`, {
			method: "PUT",
			body: { layout: workingLayout.value },
		});
		saveSuccess.value = "Saved";
		await refresh();
	} catch (e) {
		saveError.value = e instanceof Error ? e.message : String(e);
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Configure organization settings for <code>{{ org }}</code>
			</p>
		</div>

		<UiCard class="p-6" v-if="pending">
			<p class="text-gray-600 dark:text-gray-300">Loading settings...</p>
		</UiCard>

		<UiCard class="p-6" v-else-if="error">
			<div class="space-y-4">
				<p class="text-red-600">Failed to load settings.</p>
				<UiButton variant="secondary" @click="refresh()">Retry</UiButton>
			</div>
		</UiCard>

		<UiCard class="p-6" v-else>
			<div class="flex items-start justify-between gap-4">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						Dashboard Layout
					</h2>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
						Toggle visibility for org tabs. Saving requires admin/owner role.
					</p>
				</div>
				<div class="flex items-center gap-2">
					<UiButton :loading="saving" @click="save()">Save</UiButton>
					<UiButton variant="secondary" :disabled="saving" @click="refresh()">
						Reload
					</UiButton>
				</div>
			</div>

			<div v-if="saveError" class="mt-4">
				<p class="text-red-600">{{ saveError }}</p>
			</div>
			<div v-else-if="saveSuccess" class="mt-4">
				<p class="text-green-700">{{ saveSuccess }}</p>
			</div>

			<div class="mt-6 grid gap-3">
				<div
					v-for="tab in workingLayout?.tabs ?? []"
					:key="tab.id"
					class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
				>
					<div class="flex items-center justify-between">
						<div>
							<div class="font-medium text-gray-900 dark:text-white">
								{{ tab.label }}
							</div>
							<div class="text-xs text-gray-500">
								ID: <code>{{ tab.id }}</code>
								• Slots: {{ tab.slots.length }}
							</div>
						</div>
						<div class="flex items-center gap-3">
							<span class="text-sm text-gray-600 dark:text-gray-300"
							>Visible</span>
							<UiToggle
								:model-value="!tab.hidden"
								@update:model-value="(v) => (tab.hidden = !v)"
							/>
						</div>
					</div>
				</div>
			</div>
		</UiCard>
	</div>
</template>
