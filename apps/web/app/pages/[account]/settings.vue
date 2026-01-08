<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["auth", function(to, from) {
		if (to.path.endsWith("/settings")) {
			return navigateTo(to.path + "/profile");
		}
	}],
});

const settingsNav = [
	{ name: "Profile", path: "/account/settings/profile" },
	{ name: "Security", path: "/account/settings/security" },
	{ name: "Billing", path: "/account/settings/billing" },
	{ name: "Teams", path: "/account/settings/teams" },
	{ name: "Connections", path: "/account/settings/connections" },
];
</script>

<template>
	<div class="space-y-8">
		<SettingsHeader
			title="Account Settings"
			subtitle="Manage your account and preferences."
		/>

		<nav class="flex border-b border-gray-200 dark:border-gray-700">
			<NuxtLink
				v-for="item in settingsNav"
				:key="item.name"
				:to="item.path"
				class="px-4 py-2 -mb-px text-sm font-medium border-b-2"
				active-class="border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
				inactive-class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
			>
				{{ item.name }}
			</NuxtLink>
		</nav>

		<NuxtPage />
	</div>
</template>
