<script setup lang="ts">
definePageMeta({
	layout: 'account',
	middleware: ['auth']
});

const { user, isAuthenticated } = useAuth();

// Redirect if not authenticated
if (!isAuthenticated.value) {
	await navigateTo("/auth/login");
}
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
				<h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
				<p class="text-gray-600">Settings page content will go here...</p>
			</div>
		</div>
	</div>
</template>
