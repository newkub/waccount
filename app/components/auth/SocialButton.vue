<script setup lang="ts">
interface Props {
  provider: 'google'
  mode: 'signin' | 'signup'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}

const getButtonText = () => {
  if (props.provider === 'google') {
    return props.mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'
  }
  return `Sign ${props.mode} with ${props.provider}`
}

const getIcon = () => {
  if (props.provider === 'google') {
    return 'logos:google-icon'
  }
  return 'mdi:account'
}
</script>

<template>
  <button 
    @click="handleClick"
    class="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
  >
    <Icon :name="getIcon()" class="w-5 h-5" />
    <span>{{ getButtonText() }}</span>
  </button>
</template>
