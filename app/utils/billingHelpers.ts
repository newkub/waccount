export const getBillingStatusColor = (status: string) => {
	switch (status) {
		case 'active': return 'text-green-600 bg-green-50'
		case 'canceled': return 'text-red-600 bg-red-50'
		case 'past_due': return 'text-yellow-600 bg-yellow-50'
		default: return 'text-gray-600 bg-gray-50'
	}
}

export const getUsageColor = (percentage: number) => {
	if (percentage >= 90) return 'text-red-600 bg-red-50'
	if (percentage >= 70) return 'text-yellow-600 bg-yellow-50'
	return 'text-green-600 bg-green-50'
}
