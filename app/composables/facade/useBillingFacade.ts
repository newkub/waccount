import { storeToRefs } from 'pinia';
import { useBillingStore } from '~/stores/billing';
import { useBillingService } from '~/composables/services/useBillingService';

export const useBillingFacade = () => {
  const billingStore = useBillingStore();
  const {
    subscription,
    invoices,
    usage,
    loading,
    error,
    planOptions,
    currentPlan,
    daysUntilRenewal,
  } = storeToRefs(billingStore);
  const service = useBillingService();

  const fetchBillingData = async () => {
    billingStore.loading = true;
    billingStore.error = null;
    try {
      const data = await service.fetchBillingData();
      billingStore.subscription = data.subscription;
      billingStore.invoices = data.invoices;
      billingStore.usage = data.usage;
    } catch (e: any) {
      billingStore.error = e.message || 'Failed to fetch billing data';
    } finally {
      billingStore.loading = false;
    }
  };

  const changePlan = async (newPlanId: string) => {
    billingStore.loading = true;
    billingStore.error = null;
    try {
      await service.changePlan(newPlanId);
      if (billingStore.subscription) {
        billingStore.subscription.plan = newPlanId;
        const newPlan = billingStore.planOptions.find(p => p.id === newPlanId);
        billingStore.subscription.amount = newPlan?.price || 0;
      }
    } catch (e: any) {
      billingStore.error = e.message || 'Failed to change plan';
    } finally {
      billingStore.loading = false;
    }
  };

  const cancelSubscription = async () => {
    billingStore.loading = true;
    billingStore.error = null;
    try {
      await service.cancelSubscription();
      if (billingStore.subscription) {
        billingStore.subscription.cancelAtPeriodEnd = true;
      }
    } catch (e: any) {
      billingStore.error = e.message || 'Failed to cancel subscription';
    } finally {
      billingStore.loading = false;
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    const invoice = billingStore.invoices.find(inv => inv.id === invoiceId);
    if (invoice?.downloadUrl) {
      window.open(invoice.downloadUrl, '_blank');
    }
  };

  return {
    // State from store
    subscription,
    invoices,
    usage,
    loading,
    error,
    planOptions,
    currentPlan,
    daysUntilRenewal,

    // Actions
    fetchBillingData,
    changePlan,
    cancelSubscription,
    downloadInvoice,
  };
};
