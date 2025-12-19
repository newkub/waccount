<script setup lang="ts">
definePageMeta({
	layout: "account",
	middleware: ["auth"],
});

const {
    user,
    activities,
    activitiesLoading,
    loading,
    handleUpdateProfile,
    handleUploadAvatar,
    handleResendVerification,
} = useProfilePage();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		
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

			<div v-else class="space-y-8">
        <ProfileHeaderSkeleton />
        <ProfileFormSkeleton />
        <ProfileStatisticsSkeleton />
        <UserActivityLogSkeleton />
      </div>
		</div>
	</div>
</template>
