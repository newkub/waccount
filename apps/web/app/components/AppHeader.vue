<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
	<header class="flex items-center justify-between p-4 border-b">
		<div>
			<NuxtLink to="/">
				<!-- For simplicity, using text logo. You can replace with img tag for svg logos -->
				<span>{{ appConfig.name }}</span>
			</NuxtLink>
		</div>
		<nav>
			<ul class="flex items-center space-x-4">
				<li v-for="link in appConfig.header.links" :key="link.to">
					<NuxtLink :to="link.to" class="hover:underline">
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</header>
</template>
