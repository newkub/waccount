<script setup lang="ts">
const { organizations } = useAccountFacade();
</script>

<template>
	<div
		v-if="organizations.length > 0"
		class="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
	>
		<h3 class="text-lg font-semibold text-gray-900 mb-4">
			Organization Access
		</h3>
		<div class="space-y-3">
			<div
				v-for="org in organizations"
				:key="org.id"
				class="flex items-center justify-between"
			>
				<div>
					<p class="font-medium text-gray-900">{{ org.name }}</p>
					<div class="flex items-center gap-3 text-sm text-gray-600 mt-1">
						<span class="flex items-center gap-1">
							<Icon name="mdi:shield-account" class="w-4 h-4" />
							{{ org.role }}
						</span>
						<span class="flex items-center gap-1">
							<Icon name="mdi:account-multiple" class="w-4 h-4" />
							{{ org.memberCount }} members
						</span>
						<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
							{{ org.plan }}
						</span>
					</div>
				</div>
				<NuxtLink
					:to="`/account/teams`"
					class="text-blue-600 hover:text-blue-700 text-sm font-medium"
				>
					Manage →
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
