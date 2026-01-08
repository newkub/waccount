<script setup lang="ts">
const route = useRoute();

const org = computed(() => String(route.params.org ?? ""));

const subtitle = computed(() => {
	if (route.path.endsWith("/integrations")) {
		return "Manage SSO, Directory Sync, and Audit Logs.";
	}
	if (route.path.endsWith("/members")) {
		return "Manage organization members and roles.";
	}
	if (route.path.endsWith("/audit-logs")) {
		return "Export and review audit activity.";
	}
	if (route.path.endsWith("/settings")) {
		return "Configure organization settings and dashboard layout.";
	}
	return "Organization dashboard.";
});

defineEmits(["toggle-mobile-menu"]);
</script>

<template>
	<header class="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<button
						@click="$emit('toggle-mobile-menu')"
						class="lg:hidden p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-300"
					>
						<Icon name="mdi:menu" class="text-2xl" />
					</button>
					<div>
						<h1 class="text-xl font-bold text-gray-900 dark:text-white">
							{{ org || "Organization" }}
						</h1>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							{{ subtitle }}
						</p>
					</div>
				</div>

				<div class="flex items-center gap-4">
					<LayoutColorModeSwitcher />
				</div>
			</div>
		</div>
	</header>
</template>
