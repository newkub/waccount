<script setup lang="ts">
const { loading, invitations, acceptInvitation, declineInvitation } = useTeamsFacade();
</script>

<template>
	<div v-if="invitations.length > 0" class="bg-blue-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-blue-900 mb-4">
			Pending Invitations
		</h3>

		<div class="space-y-4">
			<div
				v-for="invitation in invitations"
				:key="invitation.id"
				class="bg-white rounded-lg border border-blue-200 p-4"
			>
				<div class="flex items-center justify-between">
					<div>
						<h4 class="font-semibold text-gray-900">
							{{ invitation.organizationName }}
						</h4>
						<p class="text-sm text-gray-600 mt-1">
							Invited by {{ invitation.invitedBy }} •
							{{ new Date(invitation.createdAt).toLocaleDateString() }}
						</p>
						<span
							class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-2"
						>
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
</template>
