<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const { user } = useAuth();
const { devices, loading, fetchDevices, deleteDevice } = useDevicesFacade();

onMounted(fetchDevices);

async function handleDelete(id: string) {
	if (confirm("Are you sure you want to remove this device? You will need to re-authenticate on this device.")) {
		await deleteDevice(id);
	}
}

function getDeviceIcon(type: string) {
	switch (type) {
		case "desktop":
			return "mdi:monitor";
		case "mobile":
			return "mdi:cellphone";
		case "tablet":
			return "mdi:tablet";
		default:
			return "mdi:devices";
	}
}

function getDeviceTypeLabel(type: string) {
	switch (type) {
		case "desktop":
			return "Desktop";
		case "mobile":
			return "Mobile";
		case "tablet":
			return "Tablet";
		default:
			return "Unknown";
	}
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-gray-900">Devices</h2>
		</div>

		<div v-if="devices.length === 0" class="text-center py-12">
			<Icon name="mdi:devices" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No devices registered</h3>
			<p class="text-gray-600">Devices will appear here when you log in from different devices</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="device in devices"
				:key="device.id"
				class="bg-white rounded-lg border border-gray-200 p-6"
			>
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-4">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Icon :name="getDeviceIcon(device.type)" class="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<div class="flex items-center gap-2 mb-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ device.name }}</h3>
								<span
									v-if="device.isCurrent"
									class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
								>
									Current
								</span>
							</div>
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<span>{{ getDeviceTypeLabel(device.type) }}</span>
								<span>•</span>
								span>{{ device.browser }} on {{ device.os }}</span>
								<span v-if="device.location">•</span>
								<span v-if="device.location">{{ device.location }}</span>
							</div>
							<div class="text-sm text-gray-500 mt-1">
								Last seen {{ new Date(device.lastSeenAt).toLocaleString() }}
							</div>
						</div>
					</div>
					<button
						v-if="!device.isCurrent"
						@click="handleDelete(device.id)"
						:disabled="loading"
						class="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
					>
						Remove
					</button>
					<span v-else class="text-sm text-gray-400">Active</span>
				</div>
			</div>
		</div>
	</div>
</template>
