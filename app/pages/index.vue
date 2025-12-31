<script setup lang="ts">
definePageMeta({
	layout: false,
});

useHead({
	title: "Welcome - Account Wrikka",
});
</script>

<template>
	<LayoutPublicShell>
		<div class="space-y-16">
			<LandingHeroSection />
			<LandingFeatureCards />
			<LandingCTAButtons />
		</div>
	</LayoutPublicShell>
</template>
