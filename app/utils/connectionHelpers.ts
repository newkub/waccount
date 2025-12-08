export const getProviderIcon = (providerName: string): string => {
	const iconMap: { [key: string]: string } = {
		'Google': 'mdi:google',
		'Slack': 'mdi:slack',
		'Microsoft': 'mdi:microsoft',
		'GitHub': 'mdi:github',
		'Notion': 'simple-icons:notion'
	}
	return iconMap[providerName] || 'mdi:account'
}

export const getConnectionStatusColor = (status: string) => {
	switch (status) {
		case 'active': return 'text-green-600 bg-green-50'
		case 'error': return 'text-red-600 bg-red-50'
		case 'expired': return 'text-yellow-600 bg-yellow-50'
		default: return 'text-gray-600 bg-gray-50'
	}
}
