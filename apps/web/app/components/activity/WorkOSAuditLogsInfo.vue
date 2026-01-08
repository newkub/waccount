<template>
	<div class="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
			<h3 class="text-lg font-semibold text-gray-900">WorkOS Audit Logs</h3>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="flex items-start gap-3">
				<Icon name="mdi:history" class="w-5 h-5 text-green-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Comprehensive Logging</p>
					<p class="text-sm text-gray-600">
						Track all user activities and system events
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Icon name="mdi:shield-account" class="w-5 h-5 text-blue-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Security Monitoring</p>
					<p class="text-sm text-gray-600">
						Real-time security event tracking
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Icon name="mdi:database-export" class="w-5 h-5 text-purple-600 mt-0.5" />
				<div>
					<p class="font-medium text-gray-900">Export & Compliance</p>
					<p class="text-sm text-gray-600">
						SOC 2, GDPR, and HIPAA compliant
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
