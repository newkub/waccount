<script setup lang="ts">
defineProps<{
  modelValue: 'login' | 'register';
}>();

const emit = defineEmits<(e: 'update:modelValue', tab: 'login' | 'register') => void>();
</script>

<template>
  <div class="flex border-b border-gray-200">
    <button
      @click="emit('update:modelValue', 'login')"
      :class="[
        'flex-1 py-4 px-6 text-center font-medium transition-colors',
        modelValue === 'login'
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
      ]"
    >
      เข้าสู่ระบบ
    </button>
    <button
      @click="emit('update:modelValue', 'register')"
      :class="[
        'flex-1 py-4 px-6 text-center font-medium transition-colors',
        modelValue === 'register'
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
      ]"
    >
      สมัครสมาชิก
    </button>
  </div>
</template>
