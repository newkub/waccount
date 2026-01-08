<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">
			Account Information
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
				<p class="text-gray-900 font-mono text-sm">{{ user?.id }}</p>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
				<p class="text-green-600">Active</p>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
				<p class="text-gray-900">
					{{ new Date(user?.createdAt || "").toLocaleDateString() }}
				</p>
			</div>
		</div>
	</div>
</template>
