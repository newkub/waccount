<template>
	<div class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
			<h3 class="text-lg font-semibold text-gray-900">
				Enterprise Features
			</h3>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="flex items-center gap-3">
				<Icon name="mdi:single-sign-on" class="w-5 h-5 text-green-600" />
				<div>
					<p class="font-medium text-gray-900">Single Sign-On (SSO)</p>
					<p class="text-sm text-gray-600">SAML, OIDC, and more</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<Icon
					name="mdi:shield-account-outline"
					class="w-5 h-5 text-purple-600"
				/>
				<div>
					<p class="font-medium text-gray-900">Directory Sync</p>
					<p class="text-sm text-gray-600">
						Sync with Azure AD, Google Workspace
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<Icon
					name="mdi:form-textbox-password"
					class="w-5 h-5 text-orange-600"
				/>
				<div>
					<p class="font-medium text-gray-900">Password Policies</p>
					<p class="text-sm text-gray-600">Enforce strong passwords</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<Icon name="mdi:history" class="w-5 h-5 text-red-600" />
				<div>
					<p class="font-medium text-gray-900">Audit Logs</p>
					<p class="text-sm text-gray-600">Track all user activities</p>
				</div>
			</div>
		</div>

		<div class="mt-4 pt-4 border-t border-blue-200">
			<p class="text-sm text-blue-700">
				<Icon name="mdi:information" class="w-4 h-4 inline mr-1" />
				Powered by WorkOS Enterprise features. Contact admin to enable.
			</p>
		</div>
	</div>
</template>
