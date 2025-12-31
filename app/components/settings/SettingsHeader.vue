<script setup lang="ts">
import { useAuth } from "~/composables/facade/useAuth";

const { user } = useAuth();
</script>

<template>
	<div v-if="user" class="flex items-center gap-3">
		<NuxtLink
			to="/me"
			class="p-2 hover:bg-white/60 rounded-lg transition-colors"
		>
			<Icon name="mdi:arrow-left" class="text-2xl text-gray-600" />
		</NuxtLink>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
			<p class="text-gray-600 mt-1">
				Manage your account preferences and security
			</p>
		</div>
	</div>
</template>
