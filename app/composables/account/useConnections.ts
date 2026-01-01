import { computed, ref } from "vue";
import type { Connection, Provider } from "~/shared/types";

export const useConnections = () => {
	const loading = ref(false);
	const connections = ref<Connection[]>([]);
	const availableProviders = ref<Provider[]>([]);

	const mockConnections: Connection[] = [
		{
			id: "conn_google_123",
			provider: "Google",
			type: "sso",
			status: "active",
			email: "user@example.com",
			connectedAt: "2024-01-15",
			lastUsed: "2024-03-20",
			permissions: ["email", "profile", "calendar"],
		},
		{
			id: "conn_slack_456",
			provider: "Slack",
			type: "integration",
			status: "active",
			email: "user@example.com",
			connectedAt: "2024-02-10",
			lastUsed: "2024-03-19",
			workspace: "wrikka-team",
			permissions: ["channels:read", "messages:write"],
		},
	];

	const mockProviders: Provider[] = [
		{
			id: "microsoft",
			name: "Microsoft 365",
			type: "sso",
			description: "Connect with Microsoft Azure AD",
			icon: "mdi:microsoft",
			color: "blue",
		},
		{
			id: "slack",
			name: "Slack",
			type: "integration",
			description: "Connect your Slack workspace",
			icon: "mdi:slack",
			color: "purple",
		},
		{
			id: "github",
			name: "GitHub",
			type: "integration",
			description: "Connect your GitHub account",
			icon: "mdi:github",
			color: "gray",
		},
		{
			id: "notion",
			name: "Notion",
			type: "integration",
			description: "Sync with Notion workspace",
			icon: "simple-icons:notion",
			color: "black",
		},
	];

	const fetchConnections = async () => {
		loading.value = true;
		connections.value = mockConnections;
		availableProviders.value = mockProviders;
		loading.value = false;
	};

	const ssoConnections = computed(() => connections.value.filter(conn => conn.type === "sso"));
	const integrations = computed(() => connections.value.filter(conn => conn.type === "integration"));

	const connectProvider = async (providerId: string) => {
		loading.value = true;
		console.log("Connecting to provider:", providerId);
		window.location.href = `/api/auth/workos/authorize/${providerId}`;
		loading.value = false;
	};

	const disconnectProvider = async (connectionId: string) => {
		loading.value = true;
		console.log("Disconnecting provider:", connectionId);
		connections.value = connections.value.filter(conn => conn.id !== connectionId);
		loading.value = false;
	};

	const refreshConnection = async (connectionId: string) => {
		loading.value = true;
		console.log("Refreshing connection:", connectionId);
		const connection = connections.value.find(conn => conn.id === connectionId);
		if (connection) {
			connection.lastUsed = new Date().toISOString().split("T")[0] || "";
		}
		loading.value = false;
	};

	return {
		loading,
		connections,
		availableProviders,
		fetchConnections,
		ssoConnections,
		integrations,
		connectProvider,
		disconnectProvider,
		refreshConnection,
	};
};
