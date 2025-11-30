<script setup lang="ts">
import EnhancedAuthUI from '~/components/EnhancedAuthUI.vue';

useHead({
	title: "Sign In - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<EnhancedAuthUI mode="signin" />
</template>
