<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user, signOut } = useAuth();
const {
	loading,
	preferences,
	organizations,
	fetchAccountData,
	isOrganizationAdmin,
	updatePreference,
	deleteAccount,
	enableTwoFactor,
} = useAccountFacade();

onMounted(fetchAccountData);

const handleDeleteAccount = async () => {
	await deleteAccount();
	await signOut();
};
</script>

<template>
	<div>
		<h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

		<div v-if="preferences" class="space-y-6">
			<!-- Account Information -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">
					Account Information
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
						>Account ID</label>
						<p class="text-gray-900 font-mono text-sm">{{ user?.id }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
						>Account Type</label>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
						>Account Status</label>
						<p class="text-green-600">Active</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
						>Created</label>
						<p class="text-gray-900">
							{{ new Date(user?.createdAt || "").toLocaleDateString() }}
						</p>
					</div>
				</div>
			</div>

			<!-- Preferences -->
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
							@click="updatePreference(
								'emailNotifications',
								!preferences.emailNotifications,
							)"
							:disabled="loading"
							:class="[
								'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
								preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200',
							]"
						>
							<span
								:class="[
									'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
									preferences.emailNotifications
										? 'translate-x-6'
										: 'translate-x-1',
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
							@click="updatePreference(
								'marketingEmails',
								!preferences.marketingEmails,
							)"
							:disabled="loading"
							:class="[
								'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
								preferences.marketingEmails ? 'bg-blue-600' : 'bg-gray-200',
							]"
						>
							<span
								:class="[
									'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
									preferences.marketingEmails
										? 'translate-x-6'
										: 'translate-x-1',
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

			<!-- WorkOS Organization Info -->
			<div
				v-if="organizations.length > 0"
				class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
			>
				<h3 class="text-lg font-semibold text-gray-900 mb-4">
					Organization Access
				</h3>
				<div class="space-y-3">
					<div
						v-for="org in organizations"
						:key="org.id"
						class="flex items-center justify-between"
					>
						<div>
							<p class="font-medium text-gray-900">{{ org.name }}</p>
							<div class="flex items-center gap-3 text-sm text-gray-600 mt-1">
								<span class="flex items-center gap-1">
									<Icon name="mdi:shield-account" class="w-4 h-4" />
									{{ org.role }}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="mdi:account-multiple" class="w-4 h-4" />
									{{ org.memberCount }} members
								</span>
								<span
									class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
								>
									{{ org.plan }}
								</span>
							</div>
						</div>
						<NuxtLink
							:to="`/account/teams`"
							class="text-blue-600 hover:text-blue-700 text-sm font-medium"
						>
							Manage →
						</NuxtLink>
					</div>
				</div>
			</div>

			<!-- Danger Zone -->
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium text-red-900">Delete Account</p>
							<p class="text-sm text-red-700">
								Permanently delete your account and all data
							</p>
						</div>
						<button
							@click="deleteAccount"
							:disabled="loading"
							class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
						>
							{{ loading ? "Deleting..." : "Delete Account" }}
						</button>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-4">
				<button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Save Changes
				</button>
				<button class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
