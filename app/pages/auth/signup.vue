<script setup lang="ts">
useHead({
	title: "Sign Up - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<AuthUI mode="signup" />
	</div>
</template>
