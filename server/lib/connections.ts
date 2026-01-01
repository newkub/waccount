import type { Connection, Provider } from "#shared/types/connections";
import type { H3Event } from "h3";
import { ensureUserHasOrganization } from "../utils/session";
import { createWorkos } from "../utils/workos";

// This is now a real connections provider service using WorkOS.

// This list can be static or fetched from a database, depending on the application's needs.
const availableProviders: Provider[] = [
	{
		id: "GoogleOAuth",
		name: "Google",
		type: "sso",
		description: "Connect with your Google account",
		icon: "mdi:google",
	},
	{
		id: "MicrosoftOAuth",
		name: "Microsoft",
		type: "sso",
		description: "Connect with your Microsoft account",
		icon: "mdi:microsoft",
	},
];

export const getConnections = async (event: H3Event): Promise<Connection[]> => {
	const organizationId = await ensureUserHasOrganization(event);

	const workos = createWorkos(event);
	const { data: connections } = await workos.sso.listConnections({
		organizationId,
	});

	// Map the WorkOS connection data to our application's Connection type
	return connections.map((conn): SSOConnection => ({
		id: conn.id,
		provider: conn.connectionType,
		type: "sso",
		status: conn.state,
		connectedAt: conn.createdAt,
		lastUsed: conn.updatedAt, // Using updatedAt as a proxy for lastUsed
	}));
};

export const getProviders = async (): Promise<Provider[]> => {
	return Promise.resolve(availableProviders);
};

export const deleteConnection = async (event: H3Event, connectionId: string): Promise<{ success: boolean }> => {
	const workos = createWorkos(event);
	await workos.sso.deleteConnection(connectionId);
	return { success: true };
};

export const refreshConnection = async (event: H3Event, connectionId: string): Promise<{ success: boolean }> => {
	// The WorkOS SDK does not have a 'refresh' concept for SSO connections.
	// The client-side logic handles re-fetching the connection list, which is sufficient.
	console.log(`'Refresh' requested for connection ${connectionId}, but no server-side action is needed.`);
	return { success: true };
};
