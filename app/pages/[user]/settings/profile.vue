<script setup lang="ts">
import { useAuth } from '~/composables/facade/useAuth';

const { user } = useAuth();
</script>

<template>
	<div>
		<h2 class="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
		
		<div class="space-y-6">
			<!-- Basic Info -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
						<p class="text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<p class="text-gray-900">{{ user?.email }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email Status</label>
						<p class="text-gray-900">
							<span :class="user?.emailVerified ? 'text-green-600' : 'text-yellow-600'">
								{{ user?.emailVerified ? 'Verified' : 'Pending Verification' }}
							</span>
						</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
						<p class="text-gray-900">{{ new Date(user?.createdAt || '').toLocaleDateString() }}</p>
					</div>
				</div>
			</div>

			<!-- Avatar -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
				<div class="flex items-center gap-6">
					<div class="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
						<img v-if="user?.avatar" :src="user.avatar" :alt="`${user.firstName} ${user.lastName}`" class="w-full h-full rounded-full object-cover" />
						<i v-else class="i-mdi-account text-3xl text-gray-600"></i>
					</div>
					<div>
						<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Change Avatar
						</button>
						<p class="text-sm text-gray-600 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-4">
				<button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Edit Profile
				</button>
				<button class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
