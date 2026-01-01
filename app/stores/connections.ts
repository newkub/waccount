import type { Connection, Integration, Provider, SSOConnection } from "#shared/types/connections";
import { defineStore } from "pinia";

export const useConnectionsStore = defineStore("connections", () => {
	const connections = ref<Connection[]>([]);
	const availableProviders = ref<Provider[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const ssoConnections = computed(() => connections.value.filter((conn): conn is SSOConnection => conn.type === "sso"));
	const integrations = computed(() =>
		connections.value.filter((conn): conn is Integration => conn.type === "integration")
	);

	return {
		connections,
		availableProviders,
		loading,
		error,
		ssoConnections,
		integrations,
	};
});
