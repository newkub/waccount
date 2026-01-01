<script setup lang="ts">
import { onMounted } from 'vue'
import { useTeams } from '~/composables/account/useTeams'

import { useAuth } from '~/composables/facade/useAuth';

const { user } = useAuth()
const {
  loading,
  organizations,
  invitations,
  fetchTeamsData,
  isOrganizationAdmin,
  acceptInvitation,
  declineInvitation,
  leaveOrganization,
} = useTeams()

onMounted(fetchTeamsData)
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Teams & Organizations</h2>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<Icon name="mdi:plus" class="w-4 h-4 mr-2" />
				Create Team
			</button>
		</div>
		
		<div class="space-y-6">
			<!-- Your Organizations -->
			<div class="bg-gray-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Your Organizations</h3>
				
				<div v-if="organizations.length === 0" class="text-center py-16 px-6">
					<Icon name="mdi:account-group-outline" class="w-16 h-16 text-gray-400 mx-auto mb-6" />
					<h3 class="text-xl font-semibold text-gray-800 mb-2">No Organizations Joined</h3>
					<p class="text-gray-600 max-w-md mx-auto mb-6">
						Create a new organization to collaborate with your team or join an existing one using an invitation.
					</p>
					<button class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
						Create New Organization
					</button>
				</div>
				
				<div v-else class="space-y-4">
					<div 
						v-for="org in organizations" 
						:key="org.id"
						class="bg-white rounded-lg border border-gray-200 p-4"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-4">
								<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
									<Icon name="mdi:domain" class="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<h4 class="font-semibold text-gray-900">{{ org.name }}</h4>
									<div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
										<span class="flex items-center gap-1">
											<Icon name="mdi:account-multiple" class="w-4 h-4" />
											{{ org.members }} members
										</span>
										<span class="flex items-center gap-1">
											<Icon name="mdi:shield-account" class="w-4 h-4" />
											{{ org.role }}
										</span>
										<span v-if="org.domain" class="flex items-center gap-1">
											<Icon name="mdi:web" class="w-4 h-4" />
											{{ org.domain }}
										</span>
									</div>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
									<Icon name="mdi:cog" class="w-5 h-5" />
								</button>
								<button 
									v-if="org.role !== 'admin'"
									@click="leaveOrganization(org.id)"
									:disabled="loading"
									class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
								>
									<Icon name="mdi:logout" class="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Pending Invitations -->
			<div v-if="invitations.length > 0" class="bg-blue-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-blue-900 mb-4">Pending Invitations</h3>
				
				<div class="space-y-4">
					<div 
						v-for="invitation in invitations" 
						:key="invitation.id"
						class="bg-white rounded-lg border border-blue-200 p-4"
					>
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-semibold text-gray-900">{{ invitation.organizationName }}</h4>
								<p class="text-sm text-gray-600 mt-1">
									Invited by {{ invitation.invitedBy }} • 
									{{ new Date(invitation.createdAt).toLocaleDateString() }}
								</p>
								<span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-2">
									{{ invitation.role }}
								</span>
							</div>
							<div class="flex items-center gap-2">
								<button 
									@click="acceptInvitation(invitation.id)"
									:disabled="loading"
									class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
								>
									Accept
								</button>
								<button 
									@click="declineInvitation(invitation.id)"
									:disabled="loading"
									class="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
								>
									Decline
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- WorkOS Features -->
			<div class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center gap-3 mb-4">
					<Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600" />
					<h3 class="text-lg font-semibold text-gray-900">Enterprise Features</h3>
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
						<Icon name="mdi:shield-account-outline" class="w-5 h-5 text-purple-600" />
						<div>
							<p class="font-medium text-gray-900">Directory Sync</p>
							<p class="text-sm text-gray-600">Sync with Azure AD, Google Workspace</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<Icon name="mdi:form-textbox-password" class="w-5 h-5 text-orange-600" />
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
		</div>
	</div>
</template>
