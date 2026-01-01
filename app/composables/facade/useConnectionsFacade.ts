import { storeToRefs } from "pinia";
import { useConnectionsService } from "~/composables/services/useConnectionsService";
import { useConnectionsStore } from "~/stores/connections";

export const useConnectionsFacade = () => {
	const connectionsStore = useConnectionsStore();
	const {
		connections,
		availableProviders,
		loading,
		error,
		ssoConnections,
		integrations,
	} = storeToRefs(connectionsStore);
	const service = useConnectionsService();

	const fetchConnections = async () => {
		connectionsStore.loading = true;
		connectionsStore.error = null;
		try {
			const data = await service.fetchConnections();
			connectionsStore.connections = data.connections ?? [];
			connectionsStore.availableProviders = data.availableProviders ?? [];
		} catch (e: any) {
			connectionsStore.error = e.message || "Failed to fetch connections";
		} finally {
			connectionsStore.loading = false;
		}
	};

	const connectProvider = async (providerId: string) => {
		connectionsStore.loading = true;
		// This will trigger a redirect, so no need to handle loading/error states further here.
		window.location.href = `/api/auth/workos/authorize/${providerId}`;
	};

	const disconnectProvider = async (connectionId: string) => {
		connectionsStore.loading = true;
		connectionsStore.error = null;
		try {
			await service.disconnectProvider(connectionId);
			await fetchConnections(); // Re-fetch to ensure data consistency
		} catch (e: any) {
			connectionsStore.error = e.message || "Failed to disconnect provider";
			connectionsStore.loading = false; // Ensure loading is turned off on error
		}
		// Loading state is handled by fetchConnections
	};

	const refreshConnection = async (connectionId: string) => {
		connectionsStore.loading = true;
		connectionsStore.error = null;
		try {
			await service.refreshConnection(connectionId);
			await fetchConnections(); // Re-fetch to get the updated status
		} catch (e: any) {
			connectionsStore.error = e.message || "Failed to refresh connection";
			connectionsStore.loading = false; // Ensure loading is turned off on error
		}
		// Loading state is handled by fetchConnections
	};

	return {
		// State from store
		connections,
		availableProviders,
		loading,
		error,
		ssoConnections,
		integrations,

		// Actions
		fetchConnections,
		connectProvider,
		disconnectProvider,
		refreshConnection,
	};
};
