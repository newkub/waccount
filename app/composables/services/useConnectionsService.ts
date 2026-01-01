import type { Connection, Provider } from '~/shared/types';

export const useConnectionsService = () => {
  const fetchConnections = async () => {
    const [{ data: connections }, { data: availableProviders }] = await Promise.all([
      useFetch<Connection[]>('/api/connections'),
      useFetch<Provider[]>('/api/connections/providers'),
    ]);

    return { connections: connections.value, availableProviders: availableProviders.value };
  };

  const disconnectProvider = async (connectionId: string) => {
    return useFetch(`/api/connections/${connectionId}`, {
      method: 'DELETE',
    });
  };

  const refreshConnection = async (connectionId: string) => {
    return useFetch(`/api/connections/${connectionId}/refresh`, {
      method: 'POST',
    });
  };

  return {
    fetchConnections,
    disconnectProvider,
    refreshConnection,
  };
};
