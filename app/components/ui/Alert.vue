<script setup lang="ts">
interface Props {
	type: "success" | "error";
	message: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);

const styles = computed(() => {
  if (props.type === 'success') {
    return {
      container: 'bg-green-50/90 border-green-200',
      icon: 'i-mdi-check-circle text-green-500',
      title: 'text-green-800',
      message: 'text-green-700',
      button: 'text-green-400 hover:text-green-600',
    };
  }
  return {
    container: 'bg-red-50/90 border-red-200',
    icon: 'i-mdi-alert-circle text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-400 hover:text-red-600',
  };
});
</script>

<template>
  <div class="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in">
    <div :class="['backdrop-blur-md rounded-xl p-4 shadow-xl border', styles.container]">
      <div class="flex items-center">
        <i :class="['text-xl mr-3', styles.icon]"></i>
        <div>
          <h3 :class="['text-sm font-medium', styles.title]">{{ type === 'success' ? 'Success' : 'Error' }}</h3>
          <p :class="['text-sm mt-1', styles.message]">{{ message }}</p>
        </div>
        <button @click="emit('close')" :class="['ml-auto transition-colors', styles.button]">
          <i class="i-mdi-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>
