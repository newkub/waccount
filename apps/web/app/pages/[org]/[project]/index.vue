<script setup lang="ts">
import type { User } from "~/shared/types";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();

const org = computed(() => String(route.params.org ?? ""));
const project = computed(() => String(route.params.project ?? ""));

const tab = computed(() => {
	const q = route.query.tab;
	if (typeof q === "string" && q) return q;
	return "overview";
});

type WorkspaceResolveResponse = {
	workspace: {
		id: string;
		org: string | null;
		project: string | null;
	};
	members: User[];
};

const { data, pending, error, refresh } = useFetch<WorkspaceResolveResponse>(
	"/api/workspaces/resolve",
	{
		query: computed(() => ({ org: org.value, project: project.value })),
	},
);
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				{{ org }} / {{ project }}
			</h1>
		</div>

		<div
			v-if="pending"
			class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
		>
			<p class="text-gray-600 dark:text-gray-300">Loading workspace...</p>
		</div>

		<div
			v-else-if="error"
			class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
		>
			<p class="text-red-600">Failed to load workspace.</p>
			<div class="mt-4">
				<UiButton variant="secondary" @click="refresh()">Retry</UiButton>
			</div>
		</div>

		<div v-else class="space-y-6">
			<div class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div v-if="tab === 'overview'" class="space-y-2">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						Overview
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Workspace ID: <code>{{ data?.workspace?.id }}</code>
					</p>
				</div>

				<div v-else-if="tab === 'members'" class="space-y-3">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
							Members
						</h2>
						<span class="text-sm text-gray-600 dark:text-gray-300">
							{{ data?.members?.length || 0 }}
						</span>
					</div>

					<div class="space-y-3">
						<div
							v-for="m in data?.members || []"
							:key="m.id"
							class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
						>
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{{ m.firstName || m.email }}
								</div>
								<div class="text-sm text-gray-600 dark:text-gray-300">
									{{ m.email }}
								</div>
							</div>
							<div class="text-xs text-gray-500">
								{{ m.emailVerified ? "Verified" : "Pending" }}
							</div>
						</div>
					</div>
				</div>

				<div v-else-if="tab === 'settings'" class="space-y-2">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						Settings
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Workspace settings are derived from your authenticated session.
					</p>
					<div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
						<pre class="whitespace-pre-wrap break-words">{{ data?.workspace }}</pre>
					</div>
				</div>

				<div v-else class="space-y-2">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						Unknown tab
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Use the sidebar to pick a valid section.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
