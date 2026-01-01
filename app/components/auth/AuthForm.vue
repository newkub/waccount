<script setup lang="ts">
interface Props {
  activeTab: 'signin' | 'signup'
  isLoading: boolean
  error: string
  successMessage: string
}

interface Emits {
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = defineModel<{
  email: string
  password: string
}>('form', { required: true })

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input 
        id="email" 
        v-model="form.email" 
        type="email" 
        autocomplete="email" 
        required 
        placeholder="example@email.com"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input 
        id="password" 
        v-model="form.password" 
        type="password" 
        autocomplete="current-password" 
        required 
        placeholder="••••••••"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
      />
    </div>

    <div v-if="activeTab === 'signin'" class="text-right text-sm">
      <NuxtLink to="/auth/reset-password" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
        Forgot password?
      </NuxtLink>
    </div>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-sm text-green-600">{{ successMessage }}</p>
    </div>

    <button 
      type="submit" 
      :disabled="isLoading" 
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {{ isLoading ? 'Loading...' : (activeTab === 'signin' ? 'Sign In' : 'Sign Up') }}
    </button>
  </form>
</template>
