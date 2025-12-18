// WorkOS SDK integration
// Centralized WorkOS client initialization
import { WorkOS } from "@workos-inc/node";

let workosInstance: WorkOS | null = null;

/**
 * Get WorkOS singleton instance
 */
export const getWorkOS = (): WorkOS => {
	if (!workosInstance) {
		const config = useRuntimeConfig();
		if (!config.workosApiKey) {
			throw new Error("WORKOS_API_KEY is not set in runtimeConfig");
		}
		workosInstance = new WorkOS(config.workosApiKey);
	}

	return workosInstance;
};

/**
 * Get WorkOS Client ID
 */
export const getWorkOSClientId = (): string => {
	const config = useRuntimeConfig();
	if (!config.workosClientId) {
		throw new Error("WORKOS_CLIENT_ID is not set in runtimeConfig");
	}
	return config.workosClientId;
};
