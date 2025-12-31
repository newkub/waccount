<template>
	<div class="space-y-8 animate-pulse">
		<!-- Avatar Section -->
		<div class="flex items-center gap-4">
			<div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
			<div class="space-y-2">
				<UiSkeleton height="2rem" width="8rem" />
				<UiSkeleton height="1rem" width="12rem" />
			</div>
		</div>

		<!-- Form Section -->
		<div class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<UiSkeleton height="2.5rem" />
				<UiSkeleton height="2.5rem" />
			</div>
			<UiSkeleton height="2.5rem" />
			<div class="flex justify-end">
				<UiSkeleton height="2.5rem" width="6rem" />
			</div>
		</div>
	</div>
</template>
