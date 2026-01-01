import type { Activity } from "~/shared/types";

export const useActivityFeed = () => {
	const loading = ref(false);
	const activities = ref<Activity[]>([]);
	const filter = ref("all");
	const dateRange = ref("7d");

	// Mock data - จะเชื่อมกับ WorkOS Audit Logs API
	const mockActivities: Activity[] = [
		{
			id: "audit_001",
			type: "login",
			action: "sign_in",
			description: "Signed in with Google",
			ipAddress: "192.168.1.100",
			userAgent: "Chrome 120.0.0.0 (Windows)",
			location: "Bangkok, Thailand",
			timestamp: "2024-03-20T10:30:00Z",
			success: true,
			metadata: {
				provider: "Google",
				sessionId: "sess_123",
			},
		},
		{
			id: "audit_002",
			type: "password",
			action: "change",
			description: "Password changed successfully",
			ipAddress: "192.168.1.100",
			userAgent: "Chrome 120.0.0.0 (Windows)",
			location: "Bangkok, Thailand",
			timestamp: "2024-03-19T15:45:00Z",
			success: true,
			metadata: {
				method: "web",
			},
		},
	];

	const fetchActivities = async () => {
		loading.value = true;
		// TODO: Fetch from API
		activities.value = mockActivities;
		loading.value = false;
	};

	const filteredActivities = computed(() => {
		let filtered = activities.value;

		if (filter.value !== "all") {
			filtered = filtered.filter(activity => activity.type === filter.value);
		}

		const now = new Date();
		const days = parseInt(dateRange.value.replace("d", ""));
		const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

		filtered = filtered.filter(activity => new Date(activity.timestamp) >= cutoffDate);

		return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	});

	const exportActivities = async () => {
		try {
			loading.value = true;
			console.log("Exporting activities...");

			const headers = ["Date", "Type", "Action", "Description", "IP Address", "Location", "Success"];
			const csvContent = [
				headers.join(","),
				...filteredActivities.value.map(activity =>
					[
						new Date(activity.timestamp).toISOString(),
						activity.type,
						activity.action,
						activity.description,
						activity.ipAddress,
						activity.location,
						activity.success,
					].join(",")
				),
			].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export activities:", error);
		} finally {
			loading.value = false;
		}
	};

	const getActivityStats = computed(() => {
		const stats = {
			total: filteredActivities.value.length,
			successful: filteredActivities.value.filter(a => a.success).length,
			failed: filteredActivities.value.filter(a => !a.success).length,
			byType: {} as Record<string, number>,
		};

		filteredActivities.value.forEach(activity => {
			stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
		});

		return stats;
	});

	return {
		loading,
		activities,
		filter,
		dateRange,
		fetchActivities,
		filteredActivities,
		exportActivities,
		getActivityStats,
	};
};
