<script setup lang="ts">
const colorMode = useColorMode();

const modes = [
	{ value: "light", icon: "mdi:white-balance-sunny", label: "Light" },
	{ value: "dark", icon: "mdi:moon-waning-crescent", label: "Dark" },
	{ value: "system", icon: "mdi:monitor", label: "System" },
] as const;
</script>

<template>
	<div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-sm p-1.5 flex items-center gap-1 border border-gray-200 dark:border-gray-700">
		<button
			v-for="mode in modes"
			:key="mode.value"
			@click="colorMode.preference = mode.value"
			:class="[
				'px-3 py-2 rounded-xl font-medium transition-all duration-200',
				colorMode.preference === mode.value
					? 'bg-primary-600 text-white shadow-sm'
					: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
			]"
			:aria-label="`Switch to ${mode.label} mode`"
		>
			<Icon :name="mode.icon" />
		</button>
	</div>
</template>
