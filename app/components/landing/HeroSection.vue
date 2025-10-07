<script setup lang="ts">
interface Props {
	title?: string;
	highlight?: string;
	description?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Welcome to",
	highlight: "Wrikka Account",
	description: "Secure and easy-to-use user account management system powered by WorkOS",
});
</script>

<template>
	<div class="mb-16">
		<h1 class="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
			{{ title }}
			<span class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent animate-pulse">
				{{ highlight }}
			</span>
		</h1>

		<p class="text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
			{{ description }}
		</p>
	</div>
</template>
