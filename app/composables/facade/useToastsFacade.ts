import { storeToRefs } from 'pinia';
import { useToastsStore } from '~/stores/toasts';
import type { Toast } from '~/stores/toasts';

export const useToastsFacade = () => {
  const toastsStore = useToastsStore();
  const { toasts } = storeToRefs(toastsStore);

  const addToast = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    toastsStore.addToast({ message, type, duration });
  };

  const removeToast = (id: number) => {
    toastsStore.removeToast(id);
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};
