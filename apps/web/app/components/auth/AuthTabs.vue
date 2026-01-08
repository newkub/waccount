<script setup lang="ts">
interface Props {
	activeTab: "signin" | "signup";
}

interface Emits {
	(e: "update:activeTab", tab: "signin" | "signup"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const switchTab = (tab: "signin" | "signup") => {
	emit("update:activeTab", tab);
};
</script>

<template>
	<div class="flex border-b border-gray-200">
		<button
			@click="switchTab('signin')"
			:class="[
				'flex-1 py-4 px-6 text-center font-medium transition-colors',
				activeTab === 'signin'
					? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
					: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
			]"
		>
			Sign In
		</button>
		<button
			@click="switchTab('signup')"
			:class="[
				'flex-1 py-4 px-6 text-center font-medium transition-colors',
				activeTab === 'signup'
					? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
					: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
			]"
		>
			Sign Up
		</button>
	</div>
</template>
