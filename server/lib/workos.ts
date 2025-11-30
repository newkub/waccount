// WorkOS SDK integration
// Centralized WorkOS client initialization with Nuxt best practices
import { WorkOS } from "@workos-inc/node";

// Runtime config interface
interface WorkOSConfig {
	apiKey: string
	clientId: string
	redirectUri: string
	appUrl: string
}

// Singleton instance with proper typing
let workosInstance: WorkOS | null = null;
let config: WorkOSConfig | null = null;

/**
 * Validate WorkOS configuration
 * @throws {Error} When required configuration is missing
 */
const validateConfig = (runtimeConfig: any): WorkOSConfig => {
	const apiKey = runtimeConfig.workosApiKey || process.env.WORKOS_API_KEY;
	const clientId = runtimeConfig.public?.workosClientId || process.env.WORKOS_CLIENT_ID;
	const redirectUri = runtimeConfig.public?.workosRedirectUri || process.env.WORKOS_REDIRECT_URI || 'http://localhost:3000';
	const appUrl = runtimeConfig.public?.appUrl || process.env.APP_URL || 'http://localhost:3000';

	if (!apiKey) {
		throw new Error("WorkOS API key is required. Set WORKOS_API_KEY environment variable or runtimeConfig.workosApiKey");
	}

	if (!clientId) {
		throw new Error("WorkOS Client ID is required. Set WORKOS_CLIENT_ID environment variable or runtimeConfig.public.workosClientId");
	}

	return {
		apiKey,
		clientId,
		redirectUri,
		appUrl,
	};
};

/**
 * Initialize WorkOS configuration
 * Should be called once during application startup
 */
export const initWorkOS = (runtimeConfig: any): void => {
	if (config) return; // Already initialized
	
	try {
		config = validateConfig(runtimeConfig);
		console.log('✅ WorkOS configuration initialized successfully');
	} catch (error) {
		console.error('❌ Failed to initialize WorkOS:', error);
		throw error;
	}
};

/**
 * Get WorkOS singleton instance with proper error handling
 * @returns {WorkOS} WorkOS client instance
 * @throws {Error} When WorkOS is not initialized
 */
export const getWorkOS = (): WorkOS => {
	if (!config) {
		throw new Error("WorkOS not initialized. Call initWorkOS() first");
	}

	if (!workosInstance) {
		try {
			workosInstance = new WorkOS(config.apiKey);
			console.log('✅ WorkOS client created successfully');
		} catch (error) {
			console.error('❌ Failed to create WorkOS client:', error);
			throw new Error(`Failed to initialize WorkOS client: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	return workosInstance;
};

/**
 * Get WorkOS Client ID
 * @returns {string} WorkOS Client ID
 * @throws {Error} When WorkOS is not initialized
 */
export const getWorkOSClientId = (): string => {
	if (!config) {
		throw new Error("WorkOS not initialized. Call initWorkOS() first");
	}
	return config.clientId;
};

/**
 * Get WorkOS redirect URI
 * @returns {string} Redirect URI for OAuth callbacks
 * @throws {Error} When WorkOS is not initialized
 */
export const getWorkOSRedirectUri = (): string => {
	if (!config) {
		throw new Error("WorkOS not initialized. Call initWorkOS() first");
	}
	return config.redirectUri;
};

/**
 * Get application URL
 * @returns {string} Application base URL
 * @throws {Error} When WorkOS is not initialized
 */
export const getAppUrl = (): string => {
	if (!config) {
		throw new Error("WorkOS not initialized. Call initWorkOS() first");
	}
	return config.appUrl;
};

/**
 * Reset WorkOS instance (useful for testing)
 */
export const resetWorkOS = (): void => {
	workosInstance = null;
	config = null;
	console.log('🔄 WorkOS instance reset');
};

/**
 * Check if WorkOS is initialized
 * @returns {boolean} True if WorkOS is initialized
 */
export const isWorkOSInitialized = (): boolean => {
	return config !== null;
};

/**
 * Get WorkOS configuration (for debugging)
 * @returns {Partial<WorkOSConfig>} Safe configuration object without sensitive data
 */
export const getWorkOSConfig = (): Partial<WorkOSConfig> => {
	if (!config) {
		throw new Error("WorkOS not initialized. Call initWorkOS() first");
	}
	
	// Return safe config without API key
	return {
		clientId: config.clientId,
		redirectUri: config.redirectUri,
		appUrl: config.appUrl,
	};
};
