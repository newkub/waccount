import { defineStore } from 'pinia';
import type { Invoice, Subscription, Usage } from '~/shared/types';

export const useBillingStore = defineStore('billing', () => {
  const subscription = ref<Subscription | null>(null);
  const invoices = ref<Invoice[]>([]);
  const usage = ref<Usage | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const planOptions = ref([
    { id: 'basic', name: 'Basic', price: 1999, currency: 'USD', features: [], popular: false },
    { id: 'pro', name: 'Pro', price: 2999, currency: 'USD', features: [], popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 9999, currency: 'USD', features: [], popular: false },
  ]);

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
  };
});
