<script setup lang="ts">
import type { User } from "~/shared/types";
import type { NavItem } from "~/composables/core/useWorkspaceNavigation";

defineProps<{
	user: User | null;
	navItems: NavItem[];
	currentTab: string;
}>();
</script>

<template>
	<nav class="space-y-2">
		<NuxtLink
			v-for="item in navItems"
			:key="item.id"
			:to="item.href(user?.id)"
			:class="[
				'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
				currentTab === item.id
					? 'bg-primary-100 text-primary-700 shadow-md'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
			]"
		>
			<Icon :name="item.icon" class="text-lg" />
			<span>{{ item.label }}</span>
		</NuxtLink>
	</nav>
</template>
