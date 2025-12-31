<script setup lang="ts">
const emit = defineEmits<
	{ (e: "authKit"): void; (e: "provider", provider: "google" | "github"): void }
>();

const onAuthKit = () => {
	emit("authKit");
};

const onProvider = (provider: "google" | "github") => {
	emit("provider", provider);
};
</script>

<template>
	<div class="space-y-2">
		<UiButton
			type="button"
			variant="secondary"
			class="w-full"
			@click="onAuthKit"
		>
			Continue with AuthKit
		</UiButton>
		<div class="grid gap-2 sm:grid-cols-2">
			<UiButton
				type="button"
				variant="secondary"
				@click="onProvider('google')"
			>
				<Icon name="mdi:google" class="mr-2" />
				Google
			</UiButton>
			<UiButton
				type="button"
				variant="secondary"
				@click="onProvider('github')"
			>
				<Icon name="mdi:github" class="mr-2" />
				GitHub
			</UiButton>
		</div>
		<div class="relative py-2">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-200"></div>
			</div>
			<div class="relative flex justify-center">
				<span class="bg-white px-2 text-xs text-gray-500">Or</span>
			</div>
		</div>
	</div>
</template>
