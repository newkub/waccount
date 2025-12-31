<script setup lang="ts">
import { getUserHandle } from "#shared/utils/user-handle";
import { useAuth } from "~/composables/facade/useAuth";

definePageMeta({
	layout: false,
});

const route = useRoute();

const { refreshUser, user } = useAuth();

const redirectToProviderCallback = () => {
	const queryString = route.fullPath.includes("?")
		? route.fullPath.slice(route.fullPath.indexOf("?"))
		: "";
	window.location.href = `/api/auth/workos/callback${queryString}`;
};

onMounted(async () => {
	try {
		await refreshUser();
		if (user.value) {
			await navigateTo(`/${getUserHandle(user.value)}`);
			return;
		}
		await navigateTo("/");
	} catch {
		redirectToProviderCallback();
	}
});
</script>

<template>
	<LayoutAuthShell>
		<div class="space-y-4">
			<div class="text-center space-y-2">
				<h1 class="text-2xl font-bold text-gray-900">Finishing sign in…</h1>
				<p class="text-gray-600">
					Please wait while we securely complete your session.
				</p>
			</div>
			<div class="flex items-center justify-center">
				<Icon
					name="mdi:loading"
					class="animate-spin text-4xl text-primary-500"
				/>
			</div>
		</div>
	</LayoutAuthShell>
</template>
