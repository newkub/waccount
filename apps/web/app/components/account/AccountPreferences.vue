<script setup lang="ts">
const { preferences, loading, updatePreference, enableTwoFactor } = useAccountFacade();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-gray-900">Email Notifications</p>
					<p class="text-sm text-gray-600">
						Receive email updates about your account
					</p>
				</div>
				<button
					@click="updatePreference('emailNotifications', !preferences.emailNotifications)"
					:disabled="loading"
					:class="[
						'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
						preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200',
					]"
				>
					<span
						:class="[
							'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
							preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1',
						]"
					></span>
				</button>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-gray-900">Marketing Emails</p>
					<p class="text-sm text-gray-600">
						Receive emails about new features and updates
					</p>
				</div>
				<button
					@click="updatePreference('marketingEmails', !preferences.marketingEmails)"
					:disabled="loading"
					:class="[
						'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
						preferences.marketingEmails ? 'bg-blue-600' : 'bg-gray-200',
					]"
				>
					<span
						:class="[
							'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
							preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1',
						]"
					></span>
				</button>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-gray-900">Two-Factor Authentication</p>
					<p class="text-sm text-gray-600">
						Add an extra layer of security
					</p>
				</div>
				<div
					v-if="preferences?.twoFactorEnabled"
					class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
				>
					Enabled
				</div>
				<button
					v-else
					@click="enableTwoFactor"
					:disabled="loading"
					class="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors"
				>
					Enable 2FA
				</button>
			</div>
		</div>
	</div>
</template>
