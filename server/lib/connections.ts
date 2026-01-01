// This is a mock connections provider service. In a real application, this would be replaced
// with an actual integration with a service like WorkOS Directory Sync.

import type { Connection, Provider } from '../../shared/types';

const mockConnections: Connection[] = [
    {
        id: 'conn_google_123',
        provider: 'Google',
        type: 'sso',
        status: 'active',
        email: 'user@example.com',
        connectedAt: '2024-01-15',
        lastUsed: '2024-03-20',
        permissions: ['email', 'profile', 'calendar'],
    },
    {
        id: 'conn_slack_456',
        provider: 'Slack',
        type: 'integration',
        status: 'active',
        email: 'user@example.com',
        connectedAt: '2024-02-10',
        lastUsed: '2024-03-19',
        workspace: 'wrikka-team',
        permissions: ['channels:read', 'messages:write'],
    },
];

const mockProviders: Provider[] = [
    {
        id: 'microsoft',
        name: 'Microsoft 365',
        type: 'sso',
        description: 'Connect with Microsoft Azure AD',
        icon: 'mdi:microsoft',
        color: 'blue',
    },
    {
        id: 'slack',
        name: 'Slack',
        type: 'integration',
        description: 'Connect your Slack workspace',
        icon: 'mdi:slack',
        color: 'purple',
    },
];

export const getConnections = async (): Promise<Connection[]> => {
    return Promise.resolve(mockConnections);
}

export const getProviders = async (): Promise<Provider[]> => {
    return Promise.resolve(mockProviders);
}

export const deleteConnection = async (connectionId: string): Promise<{ success: boolean }> => {
    // In a real scenario, you would call the provider's API to delete the connection
    const index = mockConnections.findIndex(c => c.id === connectionId);
    if (index > -1) {
        mockConnections.splice(index, 1);
    }
    return Promise.resolve({ success: true });
}

export const refreshConnection = async (connectionId: string): Promise<{ success: boolean }> => {
    // In a real scenario, you would call the provider's API to refresh the connection
    console.log(`Refreshing connection ${connectionId}`);
    return Promise.resolve({ success: true });
}
