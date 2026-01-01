import { storeToRefs } from 'pinia';
import { usePageAlertsStore } from '~/stores/pageAlerts';

export const usePageAlertsFacade = () => {
  const pageAlertsStore = usePageAlertsStore();
  const { successMessage, errorMessage } = storeToRefs(pageAlertsStore);

  const handleSuccess = (message: string, duration?: number) => {
    pageAlertsStore.setSuccessMessage(message, duration);
  };

  const handleError = (message: string, duration?: number) => {
    pageAlertsStore.setErrorMessage(message, duration);
  };

  return {
    successMessage,
    errorMessage,
    handleSuccess,
    handleError,
  };
};
