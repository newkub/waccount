<script setup lang="ts">
interface Props {
	showDivider?: boolean;
	mode?: "signin" | "signup";
}

const props = withDefaults(defineProps<Props>(), {
	showDivider: true,
	mode: "signin",
});

const emit = defineEmits<{
	socialAuth: [provider: string];
}>();

const socialProviders = [
	{
		id: "google",
		name: "Google",
		icon: "logos:google-icon",
		bgColor: "bg-white",
		borderColor: "border-gray-300",
		hoverBg: "hover:bg-gray-50",
		textColor: "text-gray-700",
	},
	{
		id: "github",
		name: "GitHub",
		icon: "mdi:github",
		bgColor: "bg-gray-900",
		borderColor: "border-gray-800",
		hoverBg: "hover:bg-gray-800",
		textColor: "text-white",
	},
	{
		id: "microsoft",
		name: "Microsoft",
		icon: "mdi:microsoft",
		bgColor: "bg-blue-600",
		borderColor: "border-blue-700",
		hoverBg: "hover:bg-blue-700",
		textColor: "text-white",
	},
];

const getActionText = (providerName: string) => {
	const action = props.mode === "signin" ? "Sign in" : "Sign up";
	return `${action} with ${providerName}`;
};
</script>

<template>
	<div class="space-y-6">
		<!-- Divider -->
		<div v-if="showDivider" class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-300"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="px-4 bg-white text-gray-500 font-medium"
				>Or continue with</span>
			</div>
		</div>

		<!-- Social Auth Buttons -->
		<div class="space-y-3">
			<button
				v-for="provider in socialProviders"
				:key="provider.id"
				@click="emit('socialAuth', provider.id)"
				:class="[
					'w-full inline-flex items-center justify-center gap-3 px-4 py-3 border rounded-lg shadow-sm text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]',
					provider.bgColor,
					provider.borderColor,
					provider.hoverBg,
					provider.textColor,
				]"
			>
				<Icon :name="provider.icon" class="w-5 h-5" />
				<span>{{ getActionText(provider.name) }}</span>
				<div class="flex-1"></div>
				<Icon name="mdi:chevron-right" class="w-4 h-4 opacity-60" />
			</button>
		</div>

		<!-- Trust Indicators -->
		<div class="flex items-center justify-center space-x-6 text-xs text-gray-500">
			<div class="flex items-center space-x-1">
				<Icon name="mdi:shield-check" class="w-3 h-3" />
				<span>Secure</span>
			</div>
			<div class="flex items-center space-x-1">
				<Icon name="mdi:lock" class="w-3 h-3" />
				<span>Private</span>
			</div>
			<div class="flex items-center space-x-1">
				<Icon name="mdi:clock-fast" class="w-3 h-3" />
				<span>Fast</span>
			</div>
		</div>
	</div>
</template>
