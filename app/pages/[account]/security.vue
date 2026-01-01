<script setup lang="ts">
definePageMeta({
	layout: 'dashboard',
	middleware: ['auth']
});

import { useAuth } from '~/composables/facade/useAuth';

const { user } = useAuth();
</script>

<template>
	<div>
		<h2 class="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
		
		<div class="space-y-6">
			<!-- Password -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Password</h3>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
						<input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
						<input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
						<input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Update Password
					</button>
				</div>
			</div>

			<!-- Two-Factor Authentication -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-900">Add an extra layer of security to your account</p>
						<p class="text-sm text-gray-600 mt-1">Use your phone to verify your identity when signing in</p>
					</div>
					<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
						Enable 2FA
					</button>
				</div>
			</div>

			<!-- Active Sessions -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
				<div class="space-y-3">
					<div class="flex items-center justify-between p-3 bg-white rounded-lg border">
						<div class="flex items-center gap-3">
							<i class="i-mdi-laptop text-gray-600"></i>
							<div>
								<p class="font-medium text-gray-900">Current Session</p>
								<p class="text-sm text-gray-600">Chrome on Windows • Active now</p>
							</div>
						</div>
						<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
					</div>
				</div>
				<button class="mt-4 text-red-600 hover:text-red-700 text-sm font-medium">
					Sign out all other sessions
				</button>
			</div>
		</div>
	</div>
</template>
