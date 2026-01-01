<script setup lang="ts">
import type { NavItem, User } from "#shared/types";

interface Props {
	user: User | null;
	navItems: NavItem[];
	currentTab: string;
}

defineProps<Props>();
defineEmits(["close"]);
</script>

<template>
	<div>
		<!-- Mobile Menu Overlay -->
		<div
			class="lg:hidden fixed inset-0 bg-black/50 z-40"
			@click="$emit('close')"
		>
		</div>

		<!-- Mobile Menu -->
		<div class="fixed z-50 lg:hidden">
			<LayoutAccountSidebar
				:user="user"
				:nav-items="navItems"
				:current-tab="currentTab"
			/>
		</div>
	</div>
</template>
