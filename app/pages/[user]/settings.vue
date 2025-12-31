<script setup lang="ts">
import { usePageAlerts } from "~/composables/core/usePageAlerts";
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const { user: authedUser } = useAuth();

const handle = computed(() => String(route.params.user ?? "me"));
const resolvedUserId = computed(() => {
	if (handle.value === "me") return authedUser.value?.id ?? null;
	return handle.value;
});

const isOwnerView = computed(() => {
	if (!resolvedUserId.value || !authedUser.value) return false;
	return resolvedUserId.value === authedUser.value.id;
});

watchEffect(() => {
	if (!resolvedUserId.value) return;
	if (!isOwnerView.value) {
		navigateTo("/me/settings");
	}
});

const { user } = useAuth();
const { successMessage, errorMessage, handleSuccess, handleError } =
	usePageAlerts();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<UiAlert
			v-if="successMessage"
			type="success"
			:message="successMessage"
			@close="successMessage = ''"
		/>
		<UiAlert
			v-if="errorMessage"
			type="error"
			:message="errorMessage"
			@close="errorMessage = ''"
		/>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="user" class="space-y-8">
				<SettingsHeader />

				<SettingsSection title="Account Settings" icon="mdi:account-cog">
					<div class="grid gap-6 md:grid-cols-2">
						<SettingsAccountProfile />
						<SettingsAccountSecurity
							@success="handleSuccess"
							@error="handleError"
						/>
					</div>
				</SettingsSection>

				<SettingsSection title="Privacy & Data" icon="mdi:shield-account">
					<UserDataSettings @success="handleSuccess" @error="handleError" />
				</SettingsSection>

				<SettingsSection title="Preferences" icon="mdi:tune">
					<UserNotificationSettings @success="handleSuccess" />
				</SettingsSection>
			</div>

			<div v-else class="flex items-center justify-center py-12">
				<div class="text-center">
					<Icon
						name="mdi:loading"
						class="animate-spin text-4xl text-primary-500 mb-4"
					/>
					<p class="text-gray-500">Loading settings...</p>
				</div>
			</div>
		</div>
	</div>
</template>
