<template>
  <div class="space-y-4 animate-pulse">
    <UiSkeleton height="1.5rem" width="10rem" class="mb-4" />
    <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-2">
      <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div class="flex-grow space-y-2">
        <UiSkeleton height="1rem" width="80%" />
        <UiSkeleton height="1rem" width="40%" />
      </div>
    </div>
  </div>
</template>
