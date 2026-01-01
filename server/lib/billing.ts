// This is a mock billing provider service. In a real application, this would be replaced
// with an actual integration with a service like Stripe, Lemon Squeezy, etc.

import type { Invoice, Plan, Subscription, Usage } from "#shared/types";

const mockPlans: Plan[] = [
	{
		id: "basic",
		name: "Basic",
		price: 1999,
		currency: "USD",
		features: ["Up to 10 users", "Basic analytics", "Email support"],
		popular: false,
	},
	{
		id: "pro",
		name: "Pro",
		price: 2999,
		currency: "USD",
		features: ["Unlimited users", "Advanced analytics", "Priority support", "Custom integrations"],
		popular: true,
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: 9999,
		currency: "USD",
		features: ["Everything in Pro", "Enterprise security", "Dedicated account manager", "SLA"],
		popular: false,
	},
];

let mockSubscription: Subscription = {
	id: "sub_123",
	plan: "pro",
	status: "active",
	currentPeriodStart: "2024-03-01",
	currentPeriodEnd: "2024-04-01",
	cancelAtPeriodEnd: false,
	amount: 2999,
	currency: "USD",
	features: mockPlans.find(p => p.id === "pro")?.features ?? [],
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

export const getPlans = async (): Promise<Plan[]> => {
	// In a real scenario, you would fetch this from your billing provider
	return Promise.resolve(mockPlans);
};

export const getSubscription = async (): Promise<Subscription> => {
	// In a real scenario, you would fetch this from your billing provider based on the user/org ID
	return Promise.resolve(mockSubscription);
};

export const listInvoices = async (): Promise<Invoice[]> => {
	// In a real scenario, you would fetch this from your billing provider
	return Promise.resolve(mockInvoices);
};

export const getUsage = async (): Promise<Usage> => {
	// In a real scenario, you would fetch this from your billing provider
	return Promise.resolve(mockUsage);
};

export const changePlan = async (newPlanId: string): Promise<{ success: boolean }> => {
	// In a real scenario, you would call the billing provider's API to change the subscription plan
	const newPlan = mockPlans.find(p => p.id === newPlanId);
	if (newPlan) {
		mockSubscription.plan = newPlan.id;
		mockSubscription.amount = newPlan.price;
		mockSubscription.features = newPlan.features;
	}
	return Promise.resolve({ success: true });
};

export const cancelSubscription = async (): Promise<{ success: boolean }> => {
	// In a real scenario, you would call the billing provider's API to cancel the subscription
	mockSubscription.status = "canceled";
	mockSubscription.cancelAtPeriodEnd = true;
	return Promise.resolve({ success: true });
};
