<script setup lang="ts">
defineProps<{
	title: string;
	icon: string;
}>();
</script>

<template>
	<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
		<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
			<Icon :name="icon" class="text-primary-600" />
			{{ title }}
		</h2>
		<slot />
	</div>
</template>
