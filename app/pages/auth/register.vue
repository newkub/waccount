<script setup lang="ts">
useHead({
	title: "Register - Account Wrikka",
});

definePageMeta({
	layout: "auth",
	middleware: ["guest"],
});
</script>

<template>
	<AuthUI />
</template>
