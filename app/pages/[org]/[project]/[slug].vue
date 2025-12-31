<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();

const org = computed(() => String(route.params.org ?? ""));
const project = computed(() => String(route.params.project ?? ""));
const slug = computed(() => String(route.params.slug ?? ""));

const tab = encodeURIComponent(slug.value);
await navigateTo(
	`/${encodeURIComponent(org.value)}/${
		encodeURIComponent(project.value)
	}?tab=${tab}`,
);
</script>

<template>
	<div class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
		<p class="text-gray-600 dark:text-gray-300">Redirecting...</p>
	</div>
</template>
