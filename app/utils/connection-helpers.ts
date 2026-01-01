export const getProviderIcon = (provider: string) => {
	// A more robust implementation might involve a mapping object
	return `mdi:${provider.toLowerCase().replace(/ /g, "-")}`;
};

export const getConnectionStatusColor = (status: string) => {
	if (status.toLowerCase() === "active") {
		return "bg-green-100 text-green-700";
	}
	if (status.toLowerCase() === "inactive") {
		return "bg-gray-100 text-gray-700";
	}
	return "bg-red-100 text-red-700"; // Default for 'error' or other statuses
};
