import { vi } from "vitest";

type MockWorkosUser = {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	emailVerified: boolean;
	profilePictureUrl?: string | null;
	createdAt: string;
	updatedAt: string;
	unsafeMetadata: Record<string, any>;
};

export const createMockWorkosUser = (
	overrides: Partial<MockWorkosUser> = {},
): MockWorkosUser => {
	return {
		id: "user_123",
		email: "test@example.com",
		firstName: "Test",
		lastName: "User",
		emailVerified: true,
		profilePictureUrl: null,
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z",
		unsafeMetadata: {},
		...overrides,
	};
};

export const mockWorkos = {
	userManagement: {
		loadSealedSession: vi.fn(),
		authenticateWithCode: vi.fn(),
		authenticateWithPassword: vi.fn(),
		getAuthorizationUrl: vi.fn(),
		getUser: vi.fn(),
		updateUser: vi.fn(),
		sendVerificationEmail: vi.fn(),
		createUser: vi.fn(),
		deleteUser: vi.fn(),
		listOrganizationMemberships: vi.fn(),
	},
	organizations: {
		getOrganizationByExternalId: vi.fn(),
		createOrganization: vi.fn(),
	},
	sso: {
		listConnections: vi.fn(),
	},
	directorySync: {
		listDirectories: vi.fn(),
	},
	events: {
		listEvents: vi.fn(),
	},
};

vi.mock("@workos-inc/node", () => {
	class WorkOS {
		userManagement = mockWorkos.userManagement;
		organizations = mockWorkos.organizations;
		sso = mockWorkos.sso;
		directorySync = mockWorkos.directorySync;
		events = mockWorkos.events;

		constructor(_apiKey: string, _opts: { clientId: string }) {}
	}

	return { WorkOS };
});
