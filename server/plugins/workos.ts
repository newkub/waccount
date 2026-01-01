import { defineNitroPlugin } from '#imports';
import { WorkOS } from "@workos-inc/node";
import type { H3Event } from "h3";

// Define an interface for the config
interface WorkOSConfig {
	apiKey: string;
	clientId: string;
	redirectUri: string;
	appUrl: string;
}

// Extend the H3EventContext to include our WorkOS instance and config
declare module "h3" {
	interface H3EventContext {
		workos: WorkOS;
		workosConfig: Omit<WorkOSConfig, "apiKey">;
	}
}

export default defineNitroPlugin((nitroApp) => {
	const runtimeConfig = useRuntimeConfig();

	// 1. Validate configuration
	const apiKey = runtimeConfig.workosApiKey;
	const clientId = runtimeConfig.public?.workosClientId;
	const redirectUri = runtimeConfig.public?.workosRedirectUri || "http://localhost:3000";
	const appUrl = runtimeConfig.public?.appUrl || "http://localhost:3000";

	if (!apiKey) {
		throw new Error("WorkOS API key is required. Set WORKOS_API_KEY environment variable or runtimeConfig.workosApiKey");
	}
	if (!clientId) {
		throw new Error("WorkOS Client ID is required. Set WORKOS_CLIENT_ID environment variable or runtimeConfig.public.workosClientId");
	}

	const config: WorkOSConfig = { apiKey, clientId, redirectUri, appUrl };

	// 2. Create WorkOS instance
	try {
		const workos = new WorkOS(config.apiKey);

		// 3. Inject into context for server-side use
		nitroApp.hooks.hook("request", (event: H3Event) => {
			event.context.workos = workos;
			event.context.workosConfig = {
				clientId: config.clientId,
				redirectUri: config.redirectUri,
				appUrl: config.appUrl,
			};
		});

		console.log("✅ WorkOS initialized and injected successfully.");
	} catch (error) {
		console.error("❌ Failed to initialize WorkOS:", error);
		throw error;
	}
});
