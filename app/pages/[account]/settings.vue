<script setup lang="ts">
definePageMeta({
	layout: "account",
	middleware: ["auth"],
});

const { user } = useAuth();

const successMessage = ref("");
const errorMessage = ref("");

const showPasswordForm = ref(false);

const handleSuccess = (message: string) => {
	successMessage.value = message;
	setTimeout(() => (successMessage.value = ''), 5000);
};

const handleError = (message: string) => {
	errorMessage.value = message;
	setTimeout(() => (errorMessage.value = ''), 5000);
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<UiAlert v-if="successMessage" type="success" :message="successMessage" @close="successMessage = ''" />
    <UiAlert v-if="errorMessage" type="error" :message="errorMessage" @close="errorMessage = ''" />

		<!-- Main Content -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="space-y-8">
				<!-- Page Header -->
				<div class="flex items-center gap-3">
					<NuxtLink
						:to="`/${user.id}/profile`"
						class="p-2 hover:bg-white/60 rounded-lg transition-colors"
					>
						<i class="i-mdi-arrow-left text-2xl text-gray-600"></i>
					</NuxtLink>
					<div>
						<h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
						<p class="text-gray-600 mt-1">Manage your account preferences and security</p>
					</div>
				</div>

				<!-- Account Settings -->
				<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
					<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<i class="i-mdi-account-cog text-primary-600"></i>
						Account Settings
					</h2>

					<div class="grid gap-6 md:grid-cols-2">
						<!-- Profile Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-medium text-gray-900">Profile Information</h3>
							<div class="space-y-3">
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span class="text-gray-600">Name</span>
									<span class="font-medium">{{ user.firstName }} {{ user.lastName }}</span>
								</div>
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span class="text-gray-600">Email</span>
									<span class="font-medium">{{ user.email }}</span>
								</div>
							</div>
							<NuxtLink
								:to="`/${user.id}/profile`"
								class="block w-full px-4 py-2 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors"
							>
								Edit Profile
							</NuxtLink>
						</div>

						<!-- Security Settings -->
						<div class="space-y-4">
							<h3 class="text-lg font-medium text-gray-900">Security</h3>
							<div class="space-y-3">
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span class="text-gray-600">Password</span>
									<span class="text-sm text-gray-500">••••••••</span>
								</div>
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span class="text-gray-600">Two-Factor Auth</span>
									<span class="text-sm text-amber-600">Not enabled</span>
								</div>
							</div>
							<button
								@click="showPasswordForm = !showPasswordForm"
								class="w-full px-4 py-2 border border-primary-600 text-primary-600 text-center font-medium rounded-lg hover:bg-primary-50 transition-colors"
							>
								{{ showPasswordForm ? 'Cancel' : 'Change Password' }}
							</button>
						</div>
					</div>

					<div v-if="showPasswordForm" class="mt-6 pt-6 border-t border-gray-200">
						<h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
						<UserPasswordSettings @success="handleSuccess" @error="handleError" />
					</div>
				</div>

				<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
					<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<i class="i-mdi-shield-account text-primary-600"></i>
						Privacy & Data
					</h2>
					<UserDataSettings @success="handleSuccess" @error="handleError" />
				</div>

				<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
					<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<i class="i-mdi-tune text-primary-600"></i>
						Preferences
					</h2>
					<UserNotificationSettings @success="handleSuccess" />
				</div>
			</div>

			<!-- Loading State -->
			<div v-else class="flex items-center justify-center py-12">
				<div class="text-center">
					<i class="i-mdi-loading animate-spin text-4xl text-primary-500 mb-4"></i>
					<p class="text-gray-500">Loading settings...</p>
				</div>
			</div>
		</div>
	</div>
</template>
