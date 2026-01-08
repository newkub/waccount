<script setup lang="ts">
const buttons = {
	signIn: {
		to: "/auth/login",
		label: "Get Started",
		icon: "mdi:arrow-right",
		variant: "primary" as const,
	},
	signUp: {
		to: "/auth/signup",
		label: "Create Account",
		icon: "mdi:account-plus-outline",
		variant: "secondary" as const,
	},
} as const;
</script>

<template>
	<section class="py-16">
		<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
			<NuxtLink
				v-for="button in Object.values(buttons)"
				:key="button.to"
				:to="button.to"
			>
				<UiButton :variant="button.variant" size="xl" class="group">
					{{ button.label }}
					<Icon
						:name="button.icon"
						class="ml-2 transition-transform duration-200 group-hover:translate-x-1"
					/>
				</UiButton>
			</NuxtLink>
		</div>
	</section>
</template>
