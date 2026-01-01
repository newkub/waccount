import { defineStore } from 'pinia';

export interface FeedbackMessage {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

let messageId = 0;

export const useFeedbackStore = defineStore('feedback', () => {
  const messages = ref<FeedbackMessage[]>([]);

  const addMessage = (message: Omit<FeedbackMessage, 'id'>) => {
    const id = messageId++;
    messages.value.push({ ...message, id });

    if (message.duration && message.duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, message.duration);
    }
  };

  const removeMessage = (id: number) => {
    const index = messages.value.findIndex(m => m.id === id);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  };

  return {
    messages,
    addMessage,
    removeMessage,
  };
});
