<script setup lang="ts">
import AuthUI from '~/components/auth/AuthUI.vue';

useHead({
	title: "Sign Up - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
		<AuthUI />
	</div>
</template>
