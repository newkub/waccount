<script setup lang="ts">
import EnhancedAuthUI from '~/components/EnhancedAuthUI.vue';

useHead({
	title: "Sign Up - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});
</script>

<template>
	<EnhancedAuthUI mode="signup" />
</template>
