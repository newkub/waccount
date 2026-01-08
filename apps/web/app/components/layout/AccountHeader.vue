<script setup lang="ts">
const props = defineProps<{
	currentTab: string;
}>();

defineEmits(["toggle-mobile-menu"]);

const titles = {
	profile: {
		title: "Profile Management",
		subtitle: "Manage your personal information and activity.",
	},
	settings: {
		title: "Account Settings",
		subtitle: "Configure your preferences and security.",
	},
} as const;

type TabKey = keyof typeof titles;

const getPageInfo = (tab: string) => {
	return titles[tab as TabKey] ?? titles.profile;
};

const pageInfo = computed(() => getPageInfo(props.currentTab));
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
							{{ pageInfo.title }}
						</h1>
					</div>
				</div>

				<div class="flex items-center gap-4">
					<LayoutColorModeSwitcher />
				</div>
			</div>
		</div>
	</header>
</template>
