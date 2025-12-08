<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGeneratePassword } from '~/composables/shared'

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

const { 
  generatedPassword,
  showPassword,
  passwordStrength,
  strengthColor,
  strengthText,
  generatePassword,
  copyPassword,
  togglePasswordVisibility,
  calculatePasswordStrength,
} = useGeneratePassword()

const showPasswordGenerator = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)

const handleSubmit = () => {
  emit('submit')
}

const useGeneratedPassword = () => {
  if (generatedPassword.value) {
    form.value.password = generatedPassword.value
    calculatePasswordStrength(generatedPassword.value)
    showPasswordGenerator.value = false
  }
}

const emailValidation = computed(() => {
  if (!form.value.email) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.value.email)
})

const passwordValidation = computed(() => {
  if (!form.value.password) return null
  return passwordStrength.value
})

const isFormValid = computed(() => {
  return emailValidation.value && form.value.password.length >= 8
})

const getStepIndicator = () => {
  if (props.activeTab === 'signin') {
    return [
      { step: 1, label: 'Enter email', completed: emailValidation.value },
      { step: 2, label: 'Enter password', completed: passwordValidation.value },
    ]
  } else {
    return [
      { step: 1, label: 'Create email', completed: emailValidation.value },
      { step: 2, label: 'Create password', completed: passwordValidation.value === 'strong' },
    ]
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Progress Steps -->
    <div class="flex items-center justify-between mb-6">
      <div 
        v-for="(step, index) in getStepIndicator()" 
        :key="step.step"
        class="flex items-center"
      >
        <div class="flex items-center">
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              step.completed 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            ]"
          >
            <Icon v-if="step.completed" name="mdi:check" class="w-4 h-4" />
            <span v-else>{{ step.step }}</span>
          </div>
          <span 
            :class="[
              'ml-2 text-sm font-medium',
              step.completed ? 'text-blue-600' : 'text-gray-500'
            ]"
          >
            {{ step.label }}
          </span>
        </div>
        <div 
          v-if="index < getStepIndicator().length - 1"
          class="w-8 h-0.5 mx-4"
          :class="step.completed ? 'bg-blue-600' : 'bg-gray-200'"
        ></div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email Field -->
      <div class="relative">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name="mdi:email" 
              :class="[
                'w-5 h-5 transition-colors',
                emailFocused ? 'text-blue-500' : 'text-gray-400'
              ]"
            />
          </div>
          <input 
            id="email" 
            v-model="form.email" 
            type="email" 
            autocomplete="email" 
            required 
            placeholder="you@example.com"
            class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Icon 
              v-if="emailValidation === true"
              name="mdi:check-circle" 
              class="w-5 h-5 text-green-500"
            />
            <Icon 
              v-else-if="emailValidation === false && form.email"
              name="mdi:close-circle" 
              class="w-5 h-5 text-red-500"
            />
          </div>
        </div>
        <p v-if="emailValidation === false && form.email" class="mt-1 text-sm text-red-600">
          Please enter a valid email address
        </p>
      </div>

      <!-- Password Field -->
      <div class="relative">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
          <span v-if="activeTab === 'signup'" class="text-gray-500 font-normal ml-1">
            (8+ characters recommended)
          </span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name="mdi:lock" 
              :class="[
                'w-5 h-5 transition-colors',
                passwordFocused ? 'text-blue-500' : 'text-gray-400'
              ]"
            />
          </div>
          <input 
            id="password" 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password" 
            required 
            placeholder="••••••••"
            class="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
          />
          <div class="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon 
                :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" 
                class="w-5 h-5"
              />
            </button>
            <button
              v-if="activeTab === 'signup'"
              type="button"
              @click="showPasswordGenerator = !showPasswordGenerator"
              class="p-1 ml-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Generate secure password"
            >
              <Icon name="mdi:refresh" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Password Strength Indicator -->
        <div v-if="form.password && activeTab === 'signup'" class="mt-2">
          <div class="flex items-center justify-between">
            <span :class="['text-xs font-medium', strengthColor.split(' ')[0]]">
              {{ strengthText }}
            </span>
            <div class="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                :class="[
                  'h-full transition-all duration-300',
                  passwordStrength === 'strong' ? 'w-full bg-green-500' :
                  passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                  'w-1/3 bg-red-500'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Password Generator Panel -->
      <div 
        v-if="showPasswordGenerator && activeTab === 'signup'"
        class="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">Password Generator</h3>
          <button
            type="button"
            @click="showPasswordGenerator = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <input 
            :value="generatedPassword"
            readonly
            placeholder="Click generate to create password"
            class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
          />
          <button
            type="button"
            @click="generatePassword"
            class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Icon name="mdi:refresh" class="w-4 h-4" />
          </button>
          <button
            v-if="generatedPassword"
            type="button"
            @click="copyPassword"
            class="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Icon name="mdi:content-copy" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="useGeneratedPassword"
            v-if="generatedPassword"
            class="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Use This Password
          </button>
        </div>
      </div>

      <!-- Forgot Password Link -->
      <div v-if="activeTab === 'signin'" class="text-right text-sm">
        <NuxtLink to="/auth/reset-password" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Forgot password?
        </NuxtLink>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
          <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 mr-2" />
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

      <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 mr-2" />
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="isLoading || (activeTab === 'signup' && !isFormValid)"
        class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors"
        :class="[
          isFormValid || activeTab === 'signin'
            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            : 'bg-gray-400 cursor-not-allowed'
        ]"
      >
        <Icon v-if="isLoading" name="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
        {{ isLoading ? 'Loading...' : (activeTab === 'signin' ? 'Sign In' : 'Create Account') }}
      </button>
    </form>
  </div>
</template>
