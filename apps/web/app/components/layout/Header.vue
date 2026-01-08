<script setup lang="ts">
import type { User } from "~/shared/types";
import { getUserHandle } from "~/shared/utils/user-handle";

const { user, isAuthenticated, signOut } = useAuth();

const accountHref = computed(() => {
	if (!user.value) return "/";
	return `/${getUserHandle(user.value)}`;
});
</script>

<template>
	<header class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between gap-4">
				<NuxtLink
					to="/"
					class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100"
				>
					<span
						class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white"
					>
						<Icon name="mdi:account-circle-outline" class="text-xl" />
					</span>
					<span class="hidden sm:inline">Account</span>
				</NuxtLink>

				<div class="flex items-center gap-2 sm:gap-3">
					<LayoutColorModeSwitcher />

					<template v-if="isAuthenticated && user">
						<NuxtLink :to="accountHref" class="hidden sm:inline-flex">
							<UiButton variant="secondary" size="md">
								<span class="max-w-[18ch] truncate">{{
									user.firstName || user.email
								}}</span>
							</UiButton>
						</NuxtLink>
						<UiButton variant="secondary" size="md" @click="signOut()">
							Sign out
						</UiButton>
					</template>

					<template v-else>
						<NuxtLink to="/auth/login">
							<UiButton variant="secondary" size="md">Sign in</UiButton>
						</NuxtLink>
						<NuxtLink to="/auth/signup" class="hidden sm:inline">
							<UiButton size="md">Create account</UiButton>
						</NuxtLink>
					</template>
				</div>
			</div>
		</div>
	</header>
</template>
