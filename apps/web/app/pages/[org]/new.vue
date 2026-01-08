<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const org = computed(() => String(route.params.org ?? ""));
</script>

<template>
	<div class="space-y-4">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">New</h1>
		<UiCard class="p-6">
			<p class="text-gray-600 dark:text-gray-300">
				This page is not implemented yet for <code>{{ org }}</code>.
			</p>
		</UiCard>
	</div>
</template>
