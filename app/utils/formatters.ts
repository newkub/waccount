export const formatTimestamp = (timestamp: string) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffHours < 1) {
		return "Just now";
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	} else if (diffDays < 7) {
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	} else {
		return date.toLocaleDateString();
	}
};

export const formatCurrency = (amount: number, currency: string = "USD") => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
