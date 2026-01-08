<script setup lang="ts">
import type { NavItem } from "~/composables/core/useWorkspaceNavigation";
import { useAccountNavigationFacade } from "~/composables/facade/useAccountNavigationFacade";

const route = useRoute();

const isWorkspace = computed(() => {
	const params = route.params as Record<string, unknown>;
	return typeof params.project === "string" && params.project.length > 0;
});

const isOrg = computed(() => {
	const params = route.params as Record<string, unknown>;
	return typeof params.org === "string" && params.org.length > 0
		&& !isWorkspace.value;
});

const { user } = useAuth();
const accountNav = useAccountNavigationFacade();
const orgNav = useOrgNavigationFacade();
const workspaceNav = useWorkspaceNavigation();

const currentTab = computed<string>(() =>
	isWorkspace.value
		? workspaceNav.currentTab.value
		: isOrg.value
		? orgNav.currentTab.value
		: accountNav.currentTab.value
);

const navItems = computed<NavItem[]>(() => {
	if (isWorkspace.value) return workspaceNav.navItems;
	if (isOrg.value) return orgNav.navItems.value;
	return accountNav.navItems;
});

const isMobileMenuOpen = computed({
	get: () =>
		isWorkspace.value
			? workspaceNav.isMobileMenuOpen.value
			: isOrg.value
			? orgNav.isMobileMenuOpen.value
			: accountNav.isMobileMenuOpen.value,
	set: (value) => {
		if (isWorkspace.value) {
			workspaceNav.isMobileMenuOpen.value = value;
			return;
		}
		if (isOrg.value) {
			orgNav.isMobileMenuOpen.value = value;
			return;
		}
		accountNav.isMobileMenuOpen.value = value;
	},
});

const currentTabForNav = computed(() => {
	if (isWorkspace.value) return currentTab.value;
	if (isOrg.value) return currentTab.value;
	if (currentTab.value === "profile") return "account";
	return currentTab.value;
});
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		<LayoutAccountMobileMenu
			v-if="isMobileMenuOpen"
			:user="user"
			:nav-items="navItems"
			:current-tab="currentTabForNav"
			@close="isMobileMenuOpen = false"
		/>

		<div class="lg:grid lg:grid-cols-[280px_1fr]">
			<aside class="hidden lg:block lg:h-screen lg:sticky lg:top-0">
				<LayoutAccountSidebar
					:user="user"
					:nav-items="navItems"
					:current-tab="currentTabForNav"
				/>
			</aside>

			<main class="flex-1">
				<LayoutWorkspaceHeader
					v-if="isWorkspace"
					@toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
				/>
				<LayoutOrgHeader
					v-else-if="isOrg"
					@toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
				/>
				<LayoutAccountHeader
					v-else
					:current-tab="currentTab"
					@toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
				/>

				<div class="p-4 sm:p-6 lg:p-8">
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>
