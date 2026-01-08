<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { preferences, loading, fetchPreferences, updatePreferences } = useNotificationsFacade();

const form = reactive({
	email: {
		enabled: true,
		security: true,
		billing: true,
		marketing: false,
		product: true,
	},
	push: {
		enabled: true,
		security: true,
		billing: true,
	},
	inApp: {
		enabled: true,
		security: true,
		billing: true,
	},
});

onMounted(async () => {
	await fetchPreferences();
	if (preferences.value) {
		form.email = { ...preferences.value.email };
		form.push = { ...preferences.value.push };
		form.inApp = { ...preferences.value.inApp };
	}
});

async function handleSave() {
	await updatePreferences(form);
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Notification Preferences</h2>
			<button
				@click="handleSave"
				:disabled="loading"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
			>
				{{ loading ? "Saving..." : "Save Changes" }}
			</button>
		</div>

		<div class="space-y-6">
			<NotificationSection
				title="Email Notifications"
				description="Receive notifications via email"
				icon="mdi:email"
				color="blue"
				v-model:enabled="form.email.enabled"
			>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Security Alerts</span>
						<p class="text-xs text-gray-600">Login attempts, password changes, 2FA</p>
					</div>
					<input
						v-model="form.email.security"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
				</label>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Billing Notifications</span>
						<p class="text-xs text-gray-600">Invoices, payments, subscription changes</p>
					</div>
					<input
						v-model="form.email.billing"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
				</label>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Product Updates</span>
						<p class="text-xs text-gray-600">New features, improvements, announcements</p>
					</div>
					<input
						v-model="form.email.product"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
				</label>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Marketing Emails</span>
						<p class="text-xs text-gray-600">Promotions, offers, newsletters</p>
					</div>
					<input
						v-model="form.email.marketing"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
				</label>
			</NotificationSection>

			<NotificationSection
				title="Push Notifications"
				description="Receive push notifications on your device"
				icon="mdi:bell-ring"
				color="green"
				v-model:enabled="form.push.enabled"
			>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Security Alerts</span>
						<p class="text-xs text-gray-600">Important security events</p>
					</div>
					<input
						v-model="form.push.security"
						type="checkbox"
						class="rounded border-gray-300 text-green-600 focus:ring-green-500"
					/>
				</label>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Billing Notifications</span>
						<p class="text-xs text-gray-600">Payment confirmations, invoices</p>
					</div>
					<input
						v-model="form.push.billing"
						type="checkbox"
						class="rounded border-gray-300 text-green-600 focus:ring-green-500"
					/>
				</label>
			</NotificationSection>

			<NotificationSection
				title="In-App Notifications"
				description="Show notifications in the app"
				icon="mdi:bell"
				color="purple"
				v-model:enabled="form.inApp.enabled"
			>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Security Alerts</span>
						<p class="text-xs text-gray-600">Security-related notifications</p>
					</div>
					<input
						v-model="form.inApp.security"
						type="checkbox"
						class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
					/>
				</label>
				<label class="flex items-center justify-between cursor-pointer">
					<div>
						<span class="text-sm font-medium text-gray-900">Billing Notifications</span>
						<p class="text-xs text-gray-600">Billing and subscription updates</p>
					</div>
					<input
						v-model="form.inApp.billing"
						type="checkbox"
						class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
					/>
				</label>
			</NotificationSection>
		</div>
	</div>
</template>
