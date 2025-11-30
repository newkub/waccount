<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  mode?: 'signin' | 'signup' | 'forgot-password'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'signin'
})

const { 
  signInWithPassword, 
  signUp, 
  signInWithProvider,
  loading,
  error,
  success,
  clearMessages 
} = useAuth()

const activeTab = ref<'signin' | 'signup'>(props.mode === 'signup' ? 'signup' : 'signin')
const showEmailForm = ref(false)

const form = ref({
  email: '',
  password: '',
})

const title = computed(() => {
  if (activeTab.value === 'signin') return 'Welcome Back'
  return 'Create New Account'
})

const subtitle = computed(() => {
  if (activeTab.value === 'signin') return 'Sign in to access your account'
  return 'Sign up to get started'
})

const switchTab = (tab: 'signin' | 'signup') => {
  activeTab.value = tab
  showEmailForm.value = false
  clearMessages()
}

const toggleEmailForm = () => {
  showEmailForm.value = !showEmailForm.value
  clearMessages()
}

const handleAuth = async () => {
  try {
    clearMessages()
    
    if (activeTab.value === 'signup') {
      await signUp(form.value.email, form.value.password)
    } else {
      await signInWithPassword(form.value.email, form.value.password)
    }
  } catch (err: any) {
    // Error is handled by useAuth composable
    console.error('Auth error:', err)
  }
}

const handleSocialAuth = async (provider: string) => {
  try {
    await signInWithProvider(provider)
  } catch (err: any) {
    console.error('Social auth error:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
      <!-- Main Container -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Left Side - Visual/Branding -->
          <div class="bg-linear-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-center text-white">
            <div class="space-y-6">
              <!-- Logo/Brand -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:shield-account" class="w-6 h-6" />
                </div>
                <h1 class="text-2xl font-bold">Wrikka Account</h1>
              </div>

              <!-- Welcome Message -->
              <div class="space-y-4">
                <h2 class="text-3xl lg:text-4xl font-bold">
                  {{ title }}
                </h2>
                <p class="text-blue-100 text-lg">
                  {{ subtitle }}
                </p>
              </div>

              <!-- Features -->
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-blue-200" />
                  <span class="text-blue-100">Secure authentication with WorkOS</span>
                </div>
                <div class="flex items-center space-x-3">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-blue-200" />
                  <span class="text-blue-100">Single sign-on support</span>
                </div>
                <div class="flex items-center space-x-3">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-blue-200" />
                  <span class="text-blue-100">Enterprise-grade security</span>
                </div>
              </div>

              <!-- Testimonial/Trust -->
              <div class="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="mdi:account" class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-sm font-medium">Trusted by thousands</p>
                    <p class="text-xs text-blue-200">Join our community today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Auth Form -->
          <div class="p-8 lg:p-12">
            <div class="space-y-8">
              <!-- Enhanced Tabs -->
              <EnhancedAuthTabs 
                v-model:activeTab="activeTab"
                @update:activeTab="switchTab"
              />

              <!-- Social Auth (Primary) -->
              <div class="space-y-4">
                <EnhancedSocialAuth 
                  :show-divider="false"
                  :mode="activeTab"
                  @social-auth="handleSocialAuth"
                />
              </div>

              <!-- Divider -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-gray-500 font-medium">Or use email</span>
                </div>
              </div>

              <!-- Email Toggle Button -->
              <div v-if="!showEmailForm" class="space-y-4">
                <button 
                  @click="toggleEmailForm"
                  class="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border-2 border-dashed border-blue-600 rounded-lg bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-all duration-200"
                >
                  <Icon name="mdi:email" class="w-5 h-5" />
                  <span>{{ activeTab === 'signin' ? 'Continue with Email' : 'Sign up with Email' }}</span>
                  <Icon name="mdi:chevron-down" class="w-4 h-4" />
                </button>
              </div>

              <!-- Enhanced Email Form -->
              <div v-if="showEmailForm" class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ activeTab === 'signin' ? 'Sign In with Email' : 'Create Account' }}
                    </h3>
                    <button
                      @click="toggleEmailForm"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <Icon name="mdi:close" class="w-5 h-5" />
                    </button>
                  </div>

                  <EnhancedAuthForm 
                    :activeTab="activeTab"
                    :is-loading="loading"
                    :error="error || ''"
                    :success-message="success || ''"
                    v-model:form="form"
                    @submit="handleAuth"
                  />
                </div>
              </div>

              <!-- Terms & Privacy -->
              <div class="text-center text-xs text-gray-500">
                <p>
                  By continuing, you agree to our 
                  <NuxtLink to="/terms" class="text-blue-600 hover:text-blue-500">Terms</NuxtLink> 
                  and 
                  <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-500">Privacy Policy</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center text-sm text-gray-600">
        <p>
          Need help? 
          <NuxtLink to="/support" class="text-blue-600 hover:text-blue-500">Contact Support</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
