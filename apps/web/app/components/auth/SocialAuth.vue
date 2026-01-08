<script setup lang="ts">
interface Props {
	showDivider?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showDivider: true,
});

const handleGoogleAuth = () => {
	window.location.href = "/api/auth/workos/authorize/google";
};
</script>

<template>
	<div v-if="showDivider" class="mt-6">
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-300"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="px-2 bg-white text-gray-500">Or continue with</span>
			</div>
		</div>
	</div>

	<div class="mt-6">
		<button
			@click="handleGoogleAuth"
			class="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
		>
			<Icon name="logos:google-icon" class="w-5 h-5" />
			<span>Sign in with Google</span>
		</button>
	</div>
</template>
