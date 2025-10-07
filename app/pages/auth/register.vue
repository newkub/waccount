<script setup lang="ts">
useHead({
	title: "Sign Up - Account Wrikka",
});

definePageMeta({
	middleware: ['guest']
});
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
		<div class="max-w-md w-full">
			<RegisterForm />
		</div>
	</div>
</template>
