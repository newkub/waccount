<script setup lang="ts">
definePageMeta({
	layout: "account",
	middleware: ["auth"],
});

const { user } = useAuth();
const { successMessage, errorMessage, handleSuccess, handleError } = usePageAlerts();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<UiAlert v-if="successMessage" type="success" :message="successMessage" @close="successMessage = ''" />
    <UiAlert v-if="errorMessage" type="error" :message="errorMessage" @close="errorMessage = ''" />

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="space-y-8">
				<SettingsHeader />

				<SettingsSection title="Account Settings" icon="i-mdi-account-cog">
					<div class="grid gap-6 md:grid-cols-2">
						<SettingsAccountProfile />
						<SettingsAccountSecurity @success="handleSuccess" @error="handleError" />
					</div>
				</SettingsSection>

				<SettingsSection title="Privacy & Data" icon="i-mdi-shield-account">
					<UserDataSettings @success="handleSuccess" @error="handleError" />
				</SettingsSection>

				<SettingsSection title="Preferences" icon="i-mdi-tune">
					<UserNotificationSettings @success="handleSuccess" />
				</SettingsSection>
			</div>

			<div v-else class="flex items-center justify-center py-12">
				<div class="text-center">
					<i class="i-mdi-loading animate-spin text-4xl text-primary-500 mb-4"></i>
					<p class="text-gray-500">Loading settings...</p>
				</div>
			</div>
		</div>
	</div>
</template>
