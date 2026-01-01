import type { Invoice, Subscription, Usage, Plan } from '#shared/types';

export const useBillingService = () => {
  const fetchBillingData = async () => {
    const [{ data: subscription }, { data: invoices }, { data: usage }] = await Promise.all([
      useFetch<Subscription>('/api/billing/subscription'),
      useFetch<Invoice[]>('/api/billing/invoices'),
      useFetch<Usage>('/api/billing/usage'),
    ]);

    return { subscription: subscription.value, invoices: invoices.value, usage: usage.value };
  };

  const fetchPlans = async () => {
    return useFetch<Plan[]>('/api/billing/plans');
  };

  const changePlan = async (newPlanId: string) => {
    return useFetch('/api/billing/change-plan', {
      method: 'POST',
      body: { newPlanId },
    });
  };

  const cancelSubscription = async () => {
    return useFetch('/api/billing/cancel-subscription', {
      method: 'POST',
    });
  };

  return {
    fetchBillingData,
    fetchPlans,
    changePlan,
    cancelSubscription,
  };
};
