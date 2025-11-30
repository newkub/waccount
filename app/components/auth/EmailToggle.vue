<script setup lang="ts">
interface Props {
  mode: 'signin' | 'signup'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()

const handleClick = () => {
  emit('toggle')
}

const getButtonText = () => {
  return props.mode === 'signin' ? 'Sign in with Email' : 'Sign up with Email'
}
</script>

<template>
  <button 
    @click="handleClick"
    class="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border border-blue-600 rounded-lg shadow-sm bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
  >
    <Icon name="mdi:email" class="w-5 h-5" />
    <span>{{ getButtonText() }}</span>
  </button>
</template>
