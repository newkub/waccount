<script setup lang="ts">
const { updatePassword, loading } = useAuth();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref<string | null>(null);

const emit = defineEmits(["success", "error"]);

const handleUpdatePassword = async () => {
	error.value = null;
	if (newPassword.value !== confirmPassword.value) {
		error.value = "Passwords do not match";
		emit("error", error.value);
		return;
	}

	try {
		await updatePassword(currentPassword.value, newPassword.value);
		emit("success", "Password updated successfully");
		currentPassword.value = "";
		newPassword.value = "";
		confirmPassword.value = "";
	} catch (err: unknown) {
		const errorMessage = (err as Error)?.message || "Failed to update password";
		error.value = errorMessage;
		emit("error", errorMessage);
	}
};
</script>

<template>
  <form @submit.prevent="handleUpdatePassword" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
      <UiInput v-model="currentPassword" type="password" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
      <UiInput v-model="newPassword" type="password" required minlength="8" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
      <UiInput v-model="confirmPassword" type="password" required minlength="8" />
    </div>
    <UiButton type="submit" :loading="loading">Update Password</UiButton>
    <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
  </form>
</template>
