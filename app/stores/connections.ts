import { defineStore } from 'pinia';
import type { Connection, Provider } from '~/shared/types';

export const useConnectionsStore = defineStore('connections', () => {
  const connections = ref<Connection[]>([]);
  const availableProviders = ref<Provider[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const ssoConnections = computed(() => connections.value.filter(conn => conn.type === 'sso'));
  const integrations = computed(() => connections.value.filter(conn => conn.type === 'integration'));

  return {
    connections,
    availableProviders,
    loading,
    error,
    ssoConnections,
    integrations,
  };
});
