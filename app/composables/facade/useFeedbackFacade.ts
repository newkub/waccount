import { storeToRefs } from 'pinia';
import { useFeedbackStore } from '~/stores/feedback';
import type { FeedbackMessage } from '~/stores/feedback';

export const useFeedbackFacade = () => {
  const feedbackStore = useFeedbackStore();
  const { messages } = storeToRefs(feedbackStore);

  const showMessage = (type: FeedbackMessage['type'], message: string, duration = 5000) => {
    feedbackStore.addMessage({ type, message, duration });
  };

  const showSuccess = (message: string, duration?: number) => {
    showMessage('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showMessage('error', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showMessage('warning', message, duration);
  };

  const removeMessage = (id: number) => {
    feedbackStore.removeMessage(id);
  };

  return {
    messages,
    showSuccess,
    showError,
    showWarning,
    removeMessage,
  };
};
