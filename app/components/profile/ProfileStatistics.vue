<script setup lang="ts">
import type { User } from "#shared/types";

defineProps<{
	user: User;
}>();

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};
</script>

<template>
	<div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-primary-100">
		<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
			<Icon name="mdi:chart-bar" class="text-primary-600" />
			Account Statistics
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="text-center p-4 bg-primary-50 rounded-lg">
				<div class="text-2xl font-bold text-primary-700">
					{{ formatDate(user.createdAt) }}
				</div>
				<div class="text-sm text-gray-600">Join Date</div>
			</div>
			<div class="text-center p-4 bg-primary-50 rounded-lg">
				<div class="text-2xl font-bold text-primary-700">
					{{ formatDate(user.updatedAt) }}
				</div>
				<div class="text-sm text-gray-600">Last Updated</div>
			</div>
			<div class="text-center p-4 bg-primary-50 rounded-lg">
				<div class="text-2xl font-bold text-green-600">
					{{ user.emailVerified ? "Verified" : "Pending" }}
				</div>
				<div class="text-sm text-gray-600">Email Status</div>
			</div>
		</div>
	</div>
</template>
