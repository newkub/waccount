<script setup lang="ts">
const { user, signOut } = useAuth();
</script>

<template>
	<div class="mt-8 pt-6 border-t border-gray-200 space-y-2">
		<NuxtLink
			to="/"
			class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-medium transition-all duration-200"
		>
			<Icon name="mdi:home" class="text-lg" />
			<span>Back to Home</span>
		</NuxtLink>

		<button
			@click="signOut"
			class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 w-full text-left"
		>
			<Icon name="mdi:logout" class="text-lg" />
			<span>Sign Out</span>
		</button>
	</div>
</template>
