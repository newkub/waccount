<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
	<footer class="p-4 border-t">
		<div class="flex items-center justify-between">
			<p>{{ appConfig.footer.credits }}</p>
			<ul class="flex items-center space-x-4">
				<li v-for="link in appConfig.footer.links" :key="link.to">
					<NuxtLink :to="link.to" :target="link.target" class="hover:underline">
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</div>
	</footer>
</template>
