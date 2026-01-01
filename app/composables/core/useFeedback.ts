import { ref, readonly } from 'vue';

interface FeedbackMessage {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

const messages = ref<FeedbackMessage[]>([]);

let messageId = 0;

export const useFeedback = () => {
  const addMessage = (type: FeedbackMessage['type'], message: string, duration = 5000) => {
    const id = messageId++;
    messages.value.push({ id, type, message, duration });

    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, duration);
    }
  };

  const removeMessage = (id: number) => {
    const index = messages.value.findIndex(m => m.id === id);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  };

  return {
    messages: readonly(messages),
    showSuccess: (message: string, duration?: number) => addMessage('success', message, duration),
    showError: (message: string, duration?: number) => addMessage('error', message, duration),
    showWarning: (message: string, duration?: number) => addMessage('warning', message, duration),
    removeMessage,
  };
};
