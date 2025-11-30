<script setup lang="ts">
import AuthUI from '~/components/AuthUI.vue';

useHead({
	title: "Sign In - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<AuthUI mode="signin" />
	</div>
</template>