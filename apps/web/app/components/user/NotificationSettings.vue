<script setup lang="ts">
const emailNotifications = ref(true);
const marketingEmails = ref(false);

const emit = defineEmits(["success"]);

const handleUpdateNotifications = async () => {
	// This would call an API to update preferences
	emit("success", "Notification preferences updated");
};
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900">Email Notifications</h4>
				<p class="text-sm text-gray-600">
					Receive email updates about your account
				</p>
			</div>
			<UiToggle
				v-model="emailNotifications"
				@change="handleUpdateNotifications"
			/>
		</div>
		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900">Marketing Communications</h4>
				<p class="text-sm text-gray-600">
					Receive emails about new features and updates
				</p>
			</div>
			<UiToggle v-model="marketingEmails" @change="handleUpdateNotifications" />
		</div>
	</div>
</template>
