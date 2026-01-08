<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { user } = useAuthDashboard()

// Mock user for testing
onMounted(() => {
  useAuthDashboard().setUser({
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'mdi:account',
    emailVerified: true,
  })
})
</script>
