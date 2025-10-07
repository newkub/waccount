<script setup lang="ts">
const buttons = {
	signIn: {
		to: "/auth/login",
		label: "Sign In",
		icon: "i-mdi-login",
	},
	signUp: {
		to: "/auth/register",
		label: "Sign Up",
		icon: "i-mdi-account-plus",
	},
} as const;
</script>

<template>
	<div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
		<NuxtLink
			:to="buttons.signIn.to"
			class="group relative px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2"
		>
			<div class="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			<span class="relative flex items-center gap-3">
				<i :class="buttons.signIn.icon" class="text-2xl"></i>
				{{ buttons.signIn.label }}
			</span>
		</NuxtLink>

		<NuxtLink
			:to="buttons.signUp.to"
			class="group relative px-12 py-6 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 font-bold text-lg rounded-2xl shadow-2xl border-2 border-primary-200 dark:border-gray-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2"
		>
			<span class="relative flex items-center gap-3">
				<i :class="buttons.signUp.icon" class="text-2xl"></i>
				{{ buttons.signUp.label }}
			</span>
		</NuxtLink>
	</div>
</template>
