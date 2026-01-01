<script setup lang="ts">
interface Props {
  activeTab: 'signin' | 'signup'
}

interface Emits {
  (e: 'update:activeTab', tab: 'signin' | 'signup'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const switchTab = (tab: 'signin' | 'signup') => {
  emit('update:activeTab', tab)
}

const getTabInfo = (tab: 'signin' | 'signup') => {
  return {
    signin: {
      title: 'Sign In',
      description: 'Welcome back! Please sign in to continue.',
      icon: 'mdi:login'
    },
    signup: {
      title: 'Sign Up',
      description: 'Create your account and get started today.',
      icon: 'mdi:account-plus'
    }
  }[tab]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Tab Navigation -->
    <div class="relative bg-gray-100 rounded-lg p-1">
      <div class="relative z-10">
        <nav class="flex space-x-1">
          <button
            @click="switchTab('signin')"
            :class="[
              'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'signin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <Icon name="mdi:login" class="w-4 h-4 mr-2" />
            Sign In
          </button>
          <button
            @click="switchTab('signup')"
            :class="[
              'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <Icon name="mdi:account-plus" class="w-4 h-4 mr-2" />
            Sign Up
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content Description -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        {{ getTabInfo(activeTab).title }}
      </h2>
      <p class="text-gray-600">
        {{ getTabInfo(activeTab).description }}
      </p>
    </div>

    <!-- Benefits/Features -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
        <Icon name="mdi:shield-check" class="w-6 h-6 text-blue-600 shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-gray-900">Secure</h3>
          <p class="text-xs text-gray-600">Enterprise-grade security</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
        <Icon name="mdi:flash" class="w-6 h-6 text-green-600 shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-gray-900">Fast</h3>
          <p class="text-xs text-gray-600">Lightning quick setup</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
        <Icon name="mdi:heart" class="w-6 h-6 text-purple-600 shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-gray-900">Simple</h3>
          <p class="text-xs text-gray-600">Easy to use interface</p>
        </div>
      </div>
    </div>
  </div>
</template>
