<script setup lang="ts">
definePageMeta({
	layout: 'account',
	middleware: ['auth']
});

const { user, isAuthenticated, refreshUser, resendVerificationEmail } = useAuth();
const {
	profile,
	updateUserProfile,
	uploadUserAvatar,
	getUserActivities,
	loading,
	error,
	success,
	clearMessages,
} = useUserManagement();

const activities = ref([]);
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);

// Get current tab from route
const route = useRoute();
const currentTab = computed(() => route.params.tab as string || 'profile');

// Load user activities
const loadActivities = async () => {
	if (user.value) {
		activities.value = await getUserActivities();
	}
};

// Handle profile update
const handleUpdateProfile = async (updateData: { firstName?: string; lastName?: string; profilePictureUrl?: string }) => {
	if (!user.value) return;

	try {
		await updateUserProfile(updateData);
		await refreshUser();
		showSuccessAlert.value = true;
		setTimeout(() => {
			showSuccessAlert.value = false;
		}, 5000);
	} catch (err) {
		showErrorAlert.value = true;
		setTimeout(() => {
			showErrorAlert.value = false;
		}, 5000);
	}
};

// Handle avatar upload
const handleUploadAvatar = async (file: File) => {
	if (!user.value) return;

	try {
		await uploadUserAvatar(file);
		await refreshUser();
		showSuccessAlert.value = true;
		setTimeout(() => {
			showSuccessAlert.value = false;
		}, 5000);
	} catch (err) {
		showErrorAlert.value = true;
		setTimeout(() => {
			showErrorAlert.value = false;
		}, 5000);
	}
};

// Handle resend verification email
const handleResendVerification = async () => {
	if (!user.value) return;

	try {
		await resendVerificationEmail(user.value.id);
		showSuccessAlert.value = true;
		setTimeout(() => {
			showSuccessAlert.value = false;
		}, 5000);
	} catch (err) {
		showErrorAlert.value = true;
		setTimeout(() => {
			showErrorAlert.value = false;
		}, 5000);
	}
};

// Load data on mount
onMounted(() => {
	loadActivities();
});

// Watch for success/error messages
watch([success, error], () => {
	if (success.value) {
		showSuccessAlert.value = true;
		setTimeout(() => {
			showSuccessAlert.value = false;
			clearMessages();
		}, 5000);
	}

	if (error.value) {
		showErrorAlert.value = true;
		setTimeout(() => {
			showErrorAlert.value = false;
			clearMessages();
		}, 5000);
	}
});
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<!-- Success Alert -->
		<div
			v-if="showSuccessAlert"
			class="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in"
		>
			<div class="bg-green-50/90 backdrop-blur-md border border-green-200 rounded-xl p-4 shadow-xl">
				<div class="flex items-center">
					<i class="i-mdi-check-circle text-green-500 text-xl mr-3"></i>
					<div>
						<h3 class="text-sm font-medium text-green-800">Success</h3>
						<p class="text-sm text-green-700 mt-1">{{ success }}</p>
					</div>
					<button
						@click="showSuccessAlert = false"
						class="ml-auto text-green-400 hover:text-green-600 transition-colors"
					>
						<i class="i-mdi-close"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Error Alert -->
		<div
			v-if="showErrorAlert"
			class="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in"
		>
			<div class="bg-red-50/90 backdrop-blur-md border border-red-200 rounded-xl p-4 shadow-xl">
				<div class="flex items-center">
					<i class="i-mdi-alert-circle text-red-500 text-xl mr-3"></i>
					<div>
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<p class="text-sm text-red-700 mt-1">{{ error }}</p>
					</div>
					<button
						@click="showErrorAlert = false"
						class="ml-auto text-red-400 hover:text-red-600 transition-colors"
					>
						<i class="i-mdi-close"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Main Content with Sidebar -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<!-- Sidebar Navigation -->
				<div class="lg:col-span-1">
					<div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-6 sticky top-8">
						<h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
							<i class="i-mdi-account-circle text-primary-600"></i>
							Account Management
						</h2>

						<nav class="space-y-2">
							<NuxtLink
								:to="`/${user.id}/profile`"
								:class="[
									'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
									currentTab === 'profile'
										? 'bg-primary-100 text-primary-700 shadow-md'
										: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
								]"
							>
								<i class="i-mdi-account text-lg"></i>
								<span>Profile</span>
							</NuxtLink>

							<NuxtLink
								:to="`/${user.id}/settings`"
								:class="[
									'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
									currentTab === 'settings'
										? 'bg-primary-100 text-primary-700 shadow-md'
										: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
								]"
							>
								<i class="i-mdi-cog text-lg"></i>
								<span>Settings</span>
							</NuxtLink>
						</nav>

						<!-- Quick Stats -->
						<div class="mt-8 pt-6 border-t border-gray-200">
							<h3 class="text-sm font-semibold text-gray-700 mb-3">Account Info</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">Email Status:</span>
									<span :class="user.emailVerified ? 'text-green-600' : 'text-amber-600'">
										{{ user.emailVerified ? 'Verified' : 'Pending' }}
									</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Member Since:</span>
									<span class="text-gray-900">{{ user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A' }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Main Content Area -->
				<div class="lg:col-span-3">
					<!-- Profile Tab Content -->
					<div v-if="currentTab === 'profile'" class="space-y-8">
						<!-- Profile Form -->
						<ProfileForm
							:user="user"
							:loading="loading"
							@update-profile="handleUpdateProfile"
							@upload-avatar="handleUploadAvatar"
						/>

						<!-- Email Verification Card -->
						<div v-if="!user.emailVerified" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-lg">
							<div class="flex items-start gap-4">
								<i class="i-mdi-email-alert text-amber-500 text-2xl mt-1"></i>
								<div class="flex-1">
									<h3 class="text-lg font-medium text-amber-800">Verify your email</h3>
									<p class="text-amber-700 mt-1">
										We have sent a verification link to your email {{ user.email }}. Please check your email and click the link to verify your account.
									</p>
									<button
										@click="handleResendVerification"
										:disabled="loading"
										class="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<i v-if="loading" class="i-mdi-loading animate-spin mr-2"></i>
										Resend verification email
									</button>
								</div>
							</div>
						</div>

						<!-- Account Statistics -->
						<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
							<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<i class="i-mdi-chart-bar text-primary-600"></i>
								Account Statistics
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="text-center p-4 bg-primary-50 rounded-lg">
									<div class="text-2xl font-bold text-primary-700">{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A' }}</div>
									<div class="text-sm text-gray-600">Join Date</div>
								</div>
								<div class="text-center p-4 bg-primary-50 rounded-lg">
									<div class="text-2xl font-bold text-primary-700">{{ user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A' }}</div>
									<div class="text-sm text-gray-600">Last Updated</div>
								</div>
								<div class="text-center p-4 bg-primary-50 rounded-lg">
									<div class="text-2xl font-bold text-green-600">{{ user.emailVerified ? '✓' : '○' }}</div>
									<div class="text-sm text-gray-600">Email Verified</div>
								</div>
							</div>
						</div>

						<!-- Activity Log -->
						<UserActivityLog :activities="activities" :loading="loading" />
					</div>

					<!-- Settings Tab Content -->
					<div v-else-if="currentTab === 'settings'" class="space-y-8">
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
											<span class="font-medium">{{ user.name }}</span>
										</div>
										<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<span class="text-gray-600">Email</span>
											<span class="font-medium">{{ user.email }}</span>
										</div>
									</div>
									<NuxtLink
										:to="`/${user.id}/profile`"
										class="w-full px-4 py-2 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors"
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
											<span class="text-sm text-gray-500">Last updated recently</span>
										</div>
										<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<span class="text-gray-600">Two-Factor Auth</span>
											<span class="text-sm text-amber-600">Not enabled</span>
										</div>
									</div>
									<button class="w-full px-4 py-2 border border-primary-600 text-primary-600 text-center font-medium rounded-lg hover:bg-primary-50 transition-colors">
										Manage Security
									</button>
								</div>
							</div>
						</div>

						<!-- Privacy & Data -->
						<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
							<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<i class="i-mdi-shield-account text-primary-600"></i>
								Privacy & Data
							</h2>

							<div class="space-y-6">
								<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div>
										<h4 class="font-medium text-gray-900">Data Export</h4>
										<p class="text-sm text-gray-600">Download a copy of your data</p>
									</div>
									<button class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
										Export Data
									</button>
								</div>

								<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div>
										<h4 class="font-medium text-gray-900">Account Deletion</h4>
										<p class="text-sm text-gray-600">Permanently delete your account and all data</p>
									</div>
									<button class="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors">
										Delete Account
									</button>
								</div>
							</div>
						</div>

						<!-- Preferences -->
						<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
							<h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<i class="i-mdi-tune text-primary-600"></i>
								Preferences
							</h2>

							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<div>
										<h4 class="font-medium text-gray-900">Email Notifications</h4>
										<p class="text-sm text-gray-600">Receive email updates about your account</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" class="sr-only peer" checked>
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<h4 class="font-medium text-gray-900">Marketing Communications</h4>
										<p class="text-sm text-gray-600">Receive emails about new features and updates</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" class="sr-only peer">
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div v-else class="flex items-center justify-center py-12">
				<div class="text-center">
					<i class="i-mdi-loading animate-spin text-4xl text-primary-500 mb-4"></i>
					<p class="text-gray-500">Loading data...</p>
				</div>
			</div>
		</div>
	</div>
</template>
