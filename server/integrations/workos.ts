// WorkOS SDK integration
// Centralized WorkOS client initialization
import { WorkOS } from "@workos-inc/node";

let workosInstance: WorkOS | null = null;

/**
 * Get WorkOS singleton instance
 */
export const getWorkOS = (): WorkOS => {
	if (!workosInstance) {
		const apiKey = process.env.WORKOS_API_KEY;

		if (!apiKey) {
			throw new Error("WORKOS_API_KEY environment variable is not set");
		}

		workosInstance = new WorkOS(apiKey);
	}

	return workosInstance;
};

/**
 * Get WorkOS Client ID
 */
export const getWorkOSClientId = (): string => {
	const clientId = process.env.WORKOS_CLIENT_ID;

	if (!clientId) {
		throw new Error("WORKOS_CLIENT_ID environment variable is not set");
	}

	return clientId;
};
