<script setup lang="ts">
definePageMeta({
	layout: "account",
	middleware: ["auth"],
});

import type { UpdateProfileData } from '~/app/shared/types';

const { user, refreshUser, resendVerificationEmail } = useAuth();
const {
	updateUserProfile,
	uploadUserAvatar,
	getUserActivities,
	error,
	success,
	clearMessages,
	loading,
} = useUserManagement();

const { data: activities, pending: activitiesLoading } = useAsyncData(
	"user-activities",
	() => getUserActivities(),
	{ lazy: true },
);

const handleUpdateProfile = async (updateData: UpdateProfileData) => {
	if (!user.value) return;
	await updateUserProfile(updateData);
	await refreshUser();
};

const handleUploadAvatar = async (file: File) => {
	if (!user.value) return;
	await uploadUserAvatar(file);
	await refreshUser();
};

const handleResendVerification = async () => {
	if (!user.value) return;
	await resendVerificationEmail();
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<UiAlert v-if="success" type="success" :message="success" @close="clearMessages" />
    <UiAlert v-if="error" type="error" :message="error" @close="clearMessages" />

		<!-- Main Content -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="space-y-8">
				<!-- Page Header -->
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
						<p class="text-gray-600 mt-1">Manage your profile information and view activity</p>
					</div>
					<NuxtLink
						:to="`/${user.id}/settings`"
						class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						<i class="i-mdi-cog text-lg"></i>
						<span>Settings</span>
					</NuxtLink>
				</div>

				<!-- Profile Content -->
				<div class="space-y-8">
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
					<UserActivityLog :activities="activities || []" :loading="activitiesLoading" />
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
