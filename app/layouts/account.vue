<script setup lang="ts">
const { user } = useAuth();

// Get current route for active tab detection
const route = useRoute();
const currentTab = computed(() => {
	const pathSegments = route.path.split('/');
	return pathSegments[pathSegments.length - 1] || 'profile';
});

// Navigation items
const navItems = [
	{
		id: 'profile',
		label: 'Profile',
		icon: 'i-mdi-account',
		href: (accountId: string) => `/${accountId}/profile`
	},
	{
		id: 'security',
		label: 'Security',
		icon: 'i-mdi-shield-lock',
		href: (accountId: string) => `/${accountId}/security`
	},
	{
		id: 'account',
		label: 'Account',
		icon: 'i-mdi-cog',
		href: (accountId: string) => `/${accountId}/account`
	}
];

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Close mobile menu when route changes
watch(() => route.path, () => {
	isMobileMenuOpen.value = false;
});
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<!-- Mobile Menu Button -->
		<div class="lg:hidden fixed top-4 left-4 z-50">
			<button
				@click="isMobileMenuOpen = !isMobileMenuOpen"
				class="p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-primary-100"
			>
				<i class="i-mdi-menu text-xl text-gray-700"></i>
			</button>
		</div>

		<!-- Mobile Menu Overlay -->
		<div
			v-if="isMobileMenuOpen"
			class="lg:hidden fixed inset-0 bg-black/50 z-40"
			@click="isMobileMenuOpen = false"
		></div>

		<!-- Sidebar (Desktop) / Mobile Menu (Mobile) -->
		<div
			:class="[
				'fixed lg:sticky lg:top-8 lg:left-0 lg:h-fit z-50 lg:z-auto',
				'lg:block',
				isMobileMenuOpen ? 'block' : 'hidden'
			]"
		>
			<div class="lg:bg-white/80 lg:backdrop-blur-md lg:rounded-2xl lg:shadow-xl lg:border lg:border-primary-100 lg:p-6 lg:m-4">
				<!-- Header -->
				<div class="mb-6">
					<h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
						<i class="i-mdi-account-circle text-primary-600"></i>
						Account Management
					</h2>
					<p class="text-sm text-gray-600 mt-1">Manage your account settings</p>
				</div>

				<!-- User Info -->
				<div v-if="user" class="mb-6 p-4 bg-primary-50 rounded-xl">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
							<i class="i-mdi-account text-lg text-primary-600"></i>
						</div>
						<div>
							<div class="font-medium text-gray-900">{{ user.name }}</div>
							<div class="text-sm text-gray-600">{{ user.email }}</div>
						</div>
					</div>
					<div class="text-xs text-gray-500">
						{{ user.emailVerified ? 'Email Verified' : 'Email Pending' }}
					</div>
				</div>

				<!-- Navigation -->
				<nav class="space-y-2">
					<NuxtLink
						v-for="item in navItems"
						:key="item.id"
						:to="item.href(user?.id || '')"
						:class="[
							'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
							currentTab === item.id
								? 'bg-primary-100 text-primary-700 shadow-md'
								: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
						]"
					>
						<i :class="item.icon" class="text-lg"></i>
						<span>{{ item.label }}</span>
					</NuxtLink>
				</nav>

				<!-- Footer Actions -->
				<div class="mt-8 pt-6 border-t border-gray-200 space-y-2">
					<NuxtLink
						to="/"
						class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-medium transition-all duration-200"
					>
						<i class="i-mdi-home text-lg"></i>
						<span>Back to Home</span>
					</NuxtLink>

					<button class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 w-full text-left">
						<i class="i-mdi-logout text-lg"></i>
						<span>Sign Out</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="lg:ml-80">
			<!-- Page Header -->
			<div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-6 mb-8">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">
							{{ currentTab === 'profile' ? 'Profile Management' : 'Account Settings' }}
						</h1>
						<p class="text-gray-600 mt-1">
							{{ currentTab === 'profile' ? 'Manage your personal information and profile' : 'Configure your account preferences and security' }}
						</p>
					</div>

					<!-- Breadcrumb -->
					<div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
						<NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
						<i class="i-mdi-chevron-right"></i>
						<NuxtLink :to="`/${user?.id}/profile`" class="hover:text-primary-600">Account</NuxtLink>
						<i class="i-mdi-chevron-right"></i>
						<span class="text-gray-900 font-medium">{{ currentTab === 'profile' ? 'Profile' : 'Settings' }}</span>
					</div>
				</div>
			</div>

			<!-- Page Content -->
			<div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-6">
				<slot />
			</div>
		</div>
	</div>
</template>
