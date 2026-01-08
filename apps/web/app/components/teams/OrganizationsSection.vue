<script setup lang="ts">
const { loading, organizations, leaveOrganization } = useTeamsFacade();

const emit = defineEmits<{
	createOrg: [];
}>();
</script>

<template>
	<div class="bg-gray-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">
			Your Organizations
		</h3>

		<div v-if="organizations.length === 0" class="text-center py-16 px-6">
			<Icon
				name="mdi:account-group-outline"
				class="w-16 h-16 text-gray-400 mx-auto mb-6"
			/>
			<h3 class="text-xl font-semibold text-gray-800 mb-2">
				No Organizations Joined
			</h3>
			<p class="text-gray-600 max-w-md mx-auto mb-6">
				Create a new organization to collaborate with your team or join an
				existing one using an invitation.
			</p>
			<button
				@click="emit('createOrg')"
				class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
			>
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
</template>
