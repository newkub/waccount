<template>
	<div class="min-h-screen bg-gray-100 font-sans antialiased">
		<main class="grid lg:grid-cols-2 min-h-screen">
			<div class="hidden lg:flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
				<div class="w-20 h-20 mb-8 bg-primary-500/10 text-primary-500 flex items-center justify-center rounded-full shadow-lg">
					<Icon name="mdi:shield-lock-outline" class="text-4xl" />
				</div>
				<h1 class="text-4xl font-bold text-gray-800">
					Welcome to Account.Wrikka
				</h1>
				<p class="mt-4 text-lg text-gray-600 max-w-md">
					Your central hub for managing all your Wrikka services and
					applications.
				</p>
			</div>

			<div class="flex items-center justify-center p-4 sm:p-8">
				<div class="w-full max-w-md">
					<slot />
				</div>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts"></script>
