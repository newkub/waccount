<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'lg',
});

const sizeClasses = computed(() => {
  return {
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  }[props.size];
});

const variantClasses = computed(() => {
  return {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg disabled:hover:shadow-md',
    secondary:
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:ring-primary-500',
  }[props.variant];
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:hover:translate-y-0',
      sizeClasses,
      variantClasses,
    ]"
  >
    <i v-if="loading" class="i-mdi-loading animate-spin h-5 w-5"></i>
    <span v-else class="flex items-center justify-center">
      <slot />
    </span>
  </button>
</template>
