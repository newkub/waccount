<script setup lang="ts">
interface Props {
	title?: string;
	highlight?: string;
	description?: string;
}

withDefaults(defineProps<Props>(), {
	title: "Welcome to",
	highlight: "Wrikka Account",
	description:
		"A secure, unified, and developer-first account management system for the Wrikka ecosystem.",
});
</script>

<template>
	<section class="relative py-20 sm:py-24 md:py-32">
		<div class="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white/50 dark:from-primary-950/50 dark:to-gray-950/50">
		</div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 aspect-square bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full opacity-10 blur-3xl">
		</div>

		<div class="relative text-center px-4">
			<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
				{{ title }}
				<span class="relative inline-block">
					<span
						class="absolute -inset-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg blur-xl opacity-50"
					></span>
					<span
						class="relative bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
					>
						{{ highlight }}
					</span>
				</span>
			</h1>

			<p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
				{{ description }}
			</p>
		</div>
	</section>
</template>
