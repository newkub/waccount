<script setup lang="ts">
import type { Directory } from "~/shared/types";

defineProps<{
	directories: Directory[];
}>();
</script>

<template>
	<UiCard class="p-6">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
				Directories
			</h2>
			<span class="text-sm text-gray-600 dark:text-gray-300">
				{{ directories.length }}
			</span>
		</div>

		<div v-if="directories.length === 0" class="mt-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				No directories yet.
			</p>
		</div>

		<div v-else class="mt-4 grid gap-3">
			<div
				v-for="d in directories"
				:key="d.id"
				class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<div class="font-medium text-gray-900 dark:text-white">
							{{ d.name }}
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">
							{{ d.type }} • {{ d.state }}
						</div>
					</div>
					<code class="text-xs text-gray-500">{{ d.id }}</code>
				</div>
			</div>
		</div>
	</UiCard>
</template>
