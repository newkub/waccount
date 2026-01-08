<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { sessions, loading, fetchSessions, deleteSession, revokeAllSessions } = useSessionsFacade();

onMounted(fetchSessions);

async function handleDelete(id: string) {
	if (confirm("Are you sure you want to revoke this session?")) {
		await deleteSession(id);
	}
}

async function handleRevokeAll() {
	if (confirm("Are you sure you want to revoke all sessions? You will be logged out from all devices except this one.")) {
		await revokeAllSessions();
	}
}

function getDeviceIcon(device: string) {
	if (device.toLowerCase().includes("mobile") || device.toLowerCase().includes("iphone")) {
		return "mdi:cellphone";
	}
	if (device.toLowerCase().includes("tablet") || device.toLowerCase().includes("ipad")) {
		return "mdi:tablet";
	}
	return "mdi:monitor";
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Active Sessions</h2>
			<button
				v-if="sessions.length > 1"
				@click="handleRevokeAll"
				:disabled="loading"
				class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
			>
				Revoke All Other Sessions
			</button>
		</div>

		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
			<div class="flex items-start gap-3">
				<Icon name="mdi:information" class="w-5 h-5 text-yellow-600 mt-0.5" />
				<div>
					<h4 class="font-semibold text-yellow-900">Session Management</h4>
					<p class="text-sm text-yellow-700 mt-1">
						Manage your active sessions across all devices. Revoking a session will log you out from that device.
					</p>
				</div>
			</div>
		</div>

		<div v-if="sessions.length === 0" class="text-center py-12">
			<Icon name="mdi:account-clock" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No active sessions</h3>
			<p class="text-gray-600">Sessions will appear here when you log in</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="session in sessions"
				:key="session.id"
				class="bg-white rounded-lg border border-gray-200 p-6"
			>
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-4">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Icon :name="getDeviceIcon(session.device)" class="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<div class="flex items-center gap-2 mb-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ session.device }}</h3>
								<span
									v-if="session.isCurrent"
									class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
								>
									Current
								</span>
							</div>
							<div class="flex items-center gap-4 text-sm text-gray-600">
								span>{{ session.browser }}</span>
								<span>•</span>
								span>{{ session.os }}</span>
								<span v-if="session.ipAddress">•</span>
								<span v-if="session.ipAddress">{{ session.ipAddress }}</span>
								<span v-if="session.location">•</span>
								<span v-if="session.location">{{ session.location }}</span>
							</div>
							<div class="text-sm text-gray-500 mt-1">
								Last active {{ new Date(session.lastActiveAt).toLocaleString() }}
							</div>
							<div class="text-xs text-gray-400 mt-1">
								Started {{ new Date(session.createdAt).toLocaleString() }}
							</div>
						</div>
					</div>
					<button
						v-if="!session.isCurrent"
						@click="handleDelete(session.id)"
						:disabled="loading"
						class="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
					>
						Revoke
					</button>
					<span v-else class="text-sm text-gray-400">Active</span>
				</div>
			</div>
		</div>
	</div>
</template>
