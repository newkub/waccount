<script setup lang="ts">
import { useAuth } from '~/composables/facade/useAuth';

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
		<div class="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full opacity-10 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full opacity-10 blur-3xl"></div>

		<div class="container mx-auto px-4 py-16 relative z-10">
			<div class="max-w-5xl mx-auto text-center">
				<!-- Hero Section -->
				<HeroSection />

				<!-- Guest Users -->
				<div v-if="!isAuthenticated" class="space-y-12">
					<!-- GitHub Icon Link -->
					<div class="flex justify-center">
						<a
							href="https://github.com/newkub/account.wrikka.com"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 hover:scale-110 transform transition-all duration-300 shadow-lg"
							title="View on GitHub"
						>
							<i class="i-mdi-github text-3xl"></i>
						</a>
					</div>

					<!-- Features -->
					<FeatureCards />

					<!-- Deployment & Tech Stack -->
					<div class="mt-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
						<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Ready to Deploy?</h3>

						<div class="grid md:grid-cols-2 gap-8 mb-8">
							<!-- Deployment -->
							<div class="space-y-4">
								<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
									<i class="i-mdi-rocket text-primary-600 dark:text-primary-400"></i>
									Deploy Now
								</h4>
								<div class="grid grid-cols-2 gap-4">
									<a
										href="https://vercel.com/new/clone?repository-url=https://github.com/newkub/account.wrikka.com"
										target="_blank"
										rel="noopener noreferrer"
										class="group flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 hover:scale-105 transform transition-all duration-300 shadow-lg"
									>
										<i class="i-mdi-triangle text-xl"></i>
										<span>Vercel</span>
									</a>
									<a
										href="https://dash.cloudflare.com/pages/new?template=github&repository=newkub/account.wrikka.com"
										target="_blank"
										rel="noopener noreferrer"
										class="group flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 hover:scale-105 transform transition-all duration-300 shadow-lg"
									>
										<i class="i-mdi-cloud text-xl"></i>
										<span>Cloudflare</span>
									</a>
								</div>
							</div>

							<!-- Tech Stack Preview -->
							<div class="space-y-4">
								<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
									<i class="i-mdi-code-tags text-primary-600 dark:text-primary-400"></i>
									Tech Stack
								</h4>
								<div class="flex flex-wrap gap-2">
									<span v-for="tech in ['Nuxt 4', 'Vue 3', 'WorkOS', 'TypeScript']" :key="tech" class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full">
										{{ tech }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Divider -->
					<div class="flex items-center justify-center gap-4">
						<div class="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
						<span class="text-gray-500 dark:text-gray-400 font-medium">Get Started</span>
						<div class="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
					</div>

					<!-- Authentication Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
						<NuxtLink
							to="/auth/login"
							class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
						>
							<span class="relative flex items-center gap-3">
								<i class="i-mdi-login text-xl"></i>
								Sign In
							</span>
						</NuxtLink>

						<NuxtLink
							to="/auth/register"
							class="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
						>
							<span class="relative flex items-center gap-3">
								<i class="i-mdi-account-plus text-xl"></i>
								Sign Up
							</span>
						</NuxtLink>
					</div>
				</div>

				<!-- Authenticated Users -->
				<div v-else class="space-y-8">
					<!-- GitHub Icon Link -->
					<div class="flex justify-center">
						<a
							href="https://github.com/newkub/account.wrikka.com"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 hover:scale-110 transform transition-all duration-300 shadow-lg"
							title="View on GitHub"
						>
							<i class="i-mdi-github text-3xl"></i>
						</a>
					</div>

					<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 dark:border-gray-700/50">
						<div class="text-center">
							<div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mb-8 mx-auto">
								<i class="i-mdi-account text-4xl text-primary-600 dark:text-primary-400"></i>
							</div>
							<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
								Welcome back, {{ user?.firstName }}!
							</h2>

							<p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
								You're successfully logged in and can now manage your account settings
							</p>

							<div class="flex flex-col sm:flex-row gap-6 justify-center">
								<NuxtLink
									to="/account"
									class="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
								>
									<span class="relative flex items-center gap-3">
										<i class="i-mdi-account text-xl"></i>
										My Account
									</span>
								</NuxtLink>

								<NuxtLink
									to="/account/settings"
									class="group relative px-8 py-4 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 font-bold rounded-2xl shadow-xl border-2 border-primary-200 dark:border-gray-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 hover:scale-105 transform transition-all duration-300"
								>
									<span class="relative flex items-center gap-3">
										<i class="i-mdi-cog text-xl"></i>
										Settings
									</span>
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg-grid-pattern {
	background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0);
	background-size: 20px 20px;
}
</style>
