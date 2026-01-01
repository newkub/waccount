import { defineStore } from 'pinia';
import type { Invoice, Subscription, Usage, Plan } from '~/shared/types';
import { useBillingService } from '~/composables/services/useBillingService';

export const useBillingStore = defineStore('billing', () => {
  const subscription = ref<Subscription | null>(null);
  const invoices = ref<Invoice[]>([]);
  const usage = ref<Usage | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const planOptions = ref<Plan[]>([]);

  const billingService = useBillingService();

  const fetchPlans = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await billingService.fetchPlans();
      if (data.value) {
        planOptions.value = data.value;
      }
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const currentPlan = computed(() => {
    return planOptions.value.find(plan => plan.id === subscription.value?.plan);
  });

  const daysUntilRenewal = computed(() => {
    if (!subscription.value || subscription.value.cancelAtPeriodEnd) return 0;
    const endDate = new Date(subscription.value.currentPeriodEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  });

  return {
    subscription,
    invoices,
    usage,
    loading,
    error,
    planOptions,
    currentPlan,
    daysUntilRenewal,
    fetchPlans,
  };
});
