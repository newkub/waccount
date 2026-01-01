import { storeToRefs } from 'pinia';
import { useConnectionsStore } from '~/stores/connections';
import { useConnectionsService } from '~/composables/services/useConnectionsService';

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
      connectionsStore.connections = data.connections;
      connectionsStore.availableProviders = data.availableProviders;
    } catch (e: any) {
      connectionsStore.error = e.message || 'Failed to fetch connections';
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
      connectionsStore.connections = connectionsStore.connections.filter(conn => conn.id !== connectionId);
    } catch (e: any) {
      connectionsStore.error = e.message || 'Failed to disconnect provider';
    } finally {
      connectionsStore.loading = false;
    }
  };

  const refreshConnection = async (connectionId: string) => {
    connectionsStore.loading = true;
    connectionsStore.error = null;
    try {
      await service.refreshConnection(connectionId);
      const connection = connectionsStore.connections.find(conn => conn.id === connectionId);
      if (connection) {
        connection.lastUsed = new Date().toISOString().split('T')[0] || '';
      }
    } catch (e: any) {
      connectionsStore.error = e.message || 'Failed to refresh connection';
    } finally {
      connectionsStore.loading = false;
    }
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
