<template>
	<div class="space-y-12">
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
			<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
				Ready to Deploy?
			</h3>

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
						<i
							class="i-mdi-code-tags text-primary-600 dark:text-primary-400"
						></i>
						Tech Stack
					</h4>
					<div class="flex flex-wrap gap-2">
						<span
							v-for='tech in ["Nuxt 4", "Vue 3", "WorkOS", "TypeScript"]'
							:key="tech"
							class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full"
						>
							{{ tech }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Divider -->
		<div class="flex items-center justify-center gap-4">
			<div class="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
			<span class="text-gray-500 dark:text-gray-400 font-medium"
			>Get Started</span>
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
</template>
