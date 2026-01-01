import { computed, ref } from "vue";
import type { Invoice, Subscription, Usage } from "~/shared/types";

export const useBilling = () => {
	const loading = ref(false);
	const subscription = ref<Subscription | null>(null);
	const invoices = ref<Invoice[]>([]);
	const usage = ref<Usage>({} as Usage);

	const mockSubscription: Subscription = {
		id: "sub_123",
		plan: "pro",
		status: "active",
		currentPeriodStart: "2024-03-01",
		currentPeriodEnd: "2024-04-01",
		cancelAtPeriodEnd: false,
		amount: 2999,
		currency: "USD",
		features: [
			"Unlimited users",
			"Advanced analytics",
			"Priority support",
			"Custom integrations",
			"Enterprise security",
		],
	};

	const mockInvoices: Invoice[] = [
		{
			id: "inv_001",
			date: "2024-03-01",
			amount: 2999,
			currency: "USD",
			status: "paid",
			description: "Pro Plan - March 2024",
			downloadUrl: "#",
		},
	];

	const mockUsage: Usage = {
		users: { current: 15, limit: "unlimited", percentage: 0 },
		api: { current: 45000, limit: 100000, percentage: 45 },
		storage: { current: 2.3, limit: 10, percentage: 23 },
		integrations: { current: 8, limit: "unlimited", percentage: 0 },
	};

	const planOptions = [
		{ id: "basic", name: "Basic", price: 1999, currency: "USD", features: [], popular: false },
		{ id: "pro", name: "Pro", price: 2999, currency: "USD", features: [], popular: true },
		{ id: "enterprise", name: "Enterprise", price: 9999, currency: "USD", features: [], popular: false },
	];

	const fetchBillingData = async () => {
		loading.value = true;
		subscription.value = mockSubscription;
		invoices.value = mockInvoices;
		usage.value = mockUsage;
		loading.value = false;
	};

	const currentPlan = computed(() => {
		return planOptions.find(plan => plan.id === subscription.value?.plan);
	});

	const daysUntilRenewal = computed(() => {
		if (!subscription.value || subscription.value.cancelAtPeriodEnd) return 0;
		const endDate = new Date(subscription.value.currentPeriodEnd);
		const now = new Date();
		const diffTime = endDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(0, diffDays);
	});

	const changePlan = async (newPlanId: string) => {
		loading.value = true;
		console.log("Changing plan to:", newPlanId);
		if (subscription.value) {
			subscription.value.plan = newPlanId;
			subscription.value.amount = planOptions.find(p => p.id === newPlanId)?.price || 0;
		}
		loading.value = false;
	};

	const cancelSubscription = async () => {
		loading.value = true;
		console.log("Canceling subscription...");
		if (subscription.value) {
			subscription.value.cancelAtPeriodEnd = true;
		}
		loading.value = false;
	};

	const downloadInvoice = (invoiceId: string) => {
		console.log("Downloading invoice:", invoiceId);
		window.open("#", "_blank");
	};

	return {
		loading,
		subscription,
		invoices,
		usage,
		planOptions,
		fetchBillingData,
		currentPlan,
		daysUntilRenewal,
		changePlan,
		cancelSubscription,
		downloadInvoice,
	};
};
