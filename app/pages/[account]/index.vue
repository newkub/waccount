<script setup lang="ts">
definePageMeta({
	layout: "account",
	middleware: ["auth"],
});

const {
    user,
    activities,
    activitiesLoading,
    error,
    success,
    loading,
    clearMessages,
    handleUpdateProfile,
    handleUploadAvatar,
    handleResendVerification,
} = useProfilePage();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<UiAlert v-if="success" type="success" :message="success" @close="clearMessages" />
        <UiAlert v-if="error" type="error" :message="error" @close="clearMessages" />

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="space-y-8">
				<ProfileHeader />

                <div class="space-y-8">
                    <ProfileForm
                        :user="user"
                        :loading="loading"
                        @update-profile="handleUpdateProfile"
                        @upload-avatar="handleUploadAvatar"
                    />
                    <ProfileEmailVerification @resend="handleResendVerification" />
                    <ProfileStatistics :user="user" />
                    <UserActivityLog :activities="activities || []" :loading="activitiesLoading" />
                </div>
			</div>

			<div v-else class="flex items-center justify-center py-12">
				<div class="text-center">
					<i class="i-mdi-loading animate-spin text-4xl text-primary-500 mb-4"></i>
					<p class="text-gray-500">Loading data...</p>
				</div>
			</div>
		</div>
	</div>
</template>
