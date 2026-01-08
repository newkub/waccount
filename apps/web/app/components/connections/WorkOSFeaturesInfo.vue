<template>
	<div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
			<h3 class="text-lg font-semibold text-gray-900">
				WorkOS Connection Features
			</h3>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="flex items-start gap-3">
				<Icon name="mdi:key-variant" class="w-5 h-5 text-green-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Secure OAuth 2.0</p>
					<p class="text-sm text-gray-600">
						Industry-standard authentication
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Icon name="mdi:sync" class="w-5 h-5 text-blue-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Real-time Sync</p>
					<p class="text-sm text-gray-600">
						Automatic data synchronization
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Icon name="mdi:shield-account" class="w-5 h-5 text-purple-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Enterprise Security</p>
					<p class="text-sm text-gray-600">SOC 2 Type II compliant</p>
				</div>
			</div>
		</div>
	</div>
</template>
