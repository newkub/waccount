<script setup lang="ts">
useAuth();
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-gray-100">
    <h1 class="text-xl font-bold">My Nuxt App</h1>
    <div v-if="user">
      <span>Welcome, {{ user.firstName }}</span>
      <button @click="logout" class="ml-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
    <div v-else>
      <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>
  </header>
</template>
