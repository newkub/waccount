<script setup lang="ts">
definePageMeta({
	layout: false,
});

useHead({
	title: "Welcome - Account Wrikka",
});

const { user, isAuthenticated } = useAuth();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
		<!-- Color Mode Switcher -->
		<ColorModeSwitcher />

		<!-- Background decoration -->
		<div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
		<div class="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full opacity-10 blur-3xl">
		</div>
		<div class="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full opacity-10 blur-3xl">
		</div>

		<div class="container mx-auto px-4 py-16 relative z-10">
			<div class="max-w-5xl mx-auto text-center">
				<!-- Hero Section -->
				<HeroSection />

				<!-- Conditional Rendering -->
				<LandingGuest v-if="!isAuthenticated" />
				<LandingAuthenticated v-else :user="user" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg-grid-pattern {
	background-image: radial-gradient(
		circle at 1px 1px,
		rgba(0, 0, 0, 0.15) 1px,
		transparent 0
	);
	background-size: 20px 20px;
}
</style>
