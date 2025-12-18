<script setup lang="ts">
useHead({
	title: "Login - Account Wrikka",
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
