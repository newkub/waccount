<script setup lang="ts">
const _colorMode = useColorMode();

const _modes = [
	{ value: "light", icon: "i-mdi-white-balance-sunny", label: "Light" },
	{ value: "dark", icon: "i-mdi-moon-waning-crescent", label: "Dark" },
	{ value: "system", icon: "i-mdi-monitor", label: "System" },
] as const;
</script>

<template>
	<div class="fixed top-6 right-6 z-50">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
			<button
				v-for="mode in modes"
				:key="mode.value"
				@click="colorMode.preference = mode.value"
				:class="[
					'px-4 py-2 rounded-xl font-medium transition-all duration-300',
					colorMode.preference === mode.value
						? 'bg-primary-600 text-white shadow-lg'
						: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
				]"
				:aria-label="`Switch to ${mode.label} mode`"
			>
				<i :class="mode.icon"></i>
			</button>
		</div>
	</div>
</template>
