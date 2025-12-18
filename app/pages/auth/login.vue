<script setup lang="ts">
useHead({
	title: "Login - Account Wrikka",
});

definePageMeta({
	layout: "auth",
	middleware: ["guest"],
});
</script>

<template>
	<AuthUI />
</template>
