<script setup lang="ts">
const _features = [
	{
		title: "Secure",
		icon: "i-mdi-shield-check",
		description:
			"Enterprise-grade security with WorkOS authentication, data encryption, and compliance standards",
	},
	{
		title: "Fast",
		icon: "i-mdi-lightning-bolt",
		description:
			"Lightning-fast authentication via Google, GitHub, Microsoft, or email with magic links",
	},
	{
		title: "Customizable",
		icon: "i-mdi-cog",
		description:
			"Fully customizable user profiles, settings, and account management with intuitive interface",
	},
] as const;
</script>

<template>
	<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
		<div
			v-for="feature in features"
			:key="feature.title"
			class="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 border border-white/50 dark:border-gray-700/50"
		>
			<div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
				<i :class="[feature.icon, 'text-3xl text-primary-600 dark:text-primary-400']"></i>
			</div>
			<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ feature.title }}</h3>
			<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
				{{ feature.description }}
			</p>
		</div>
	</div>
</template>
