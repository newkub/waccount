<script setup lang="ts">
interface Props {
	mode: "signin" | "signup";
}

const props = defineProps<Props>();

const emit = defineEmits<{
	toggle: [];
}>();

const handleClick = () => {
	emit("toggle");
};

const getButtonText = () => {
	return props.mode === "signin" ? "Sign in with Email" : "Sign up with Email";
};
</script>

<template>
	<button
		@click="handleClick"
		class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-blue-600 rounded-lg shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors cursor-pointer"
	>
		<!-- Email Icon SVG -->
		<svg
			class="w-5 h-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="m20 6-8 5-8-5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span>{{ getButtonText() }}</span>
	</button>
</template>
