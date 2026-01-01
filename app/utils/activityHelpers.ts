export const getActivityIcon = (type: string, action: string) => {
	const iconMap: { [key: string]: string } = {
		'login_sign_in': 'mdi:login',
		'login_sign_out': 'mdi:logout',
		'login_failed_attempt': 'mdi:login-alert',
		'password_change': 'mdi:key-change',
		'password_reset': 'mdi:key-reset',
		'profile_update': 'mdi:account-edit',
		'organization_join': 'mdi:account-multiple-plus',
		'organization_leave': 'mdi:account-multiple-minus',
		'security_enable_2fa': 'mdi:shield-check',
		'security_disable_2fa': 'mdi:shield-off',
		'connection_add': 'mdi:link-plus',
		'connection_remove': 'mdi:link-minus'
	}
	return iconMap[`${type}_${action}`] || 'mdi:information'
}

export const getActivityColor = (type: string, success: boolean) => {
	if (!success) return 'text-red-600 bg-red-50'
	
	const colorMap: { [key: string]: string } = {
		'login': 'text-blue-600 bg-blue-50',
		'password': 'text-orange-600 bg-orange-50',
		'profile': 'text-green-600 bg-green-50',
		'organization': 'text-purple-600 bg-purple-50',
		'security': 'text-red-600 bg-red-50',
		'connection': 'text-indigo-600 bg-indigo-50'
	}
	return colorMap[type] || 'text-gray-600 bg-gray-50'
}
